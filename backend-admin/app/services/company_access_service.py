from uuid import uuid4
from datetime import datetime
from app.db.models import CompanyAccess
from app.utils import get_cr_today_date
from .company_service import CompanyService
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories import CompanyAccessRepository
from app.core import ValidationException, NotFoundException
from app.schemas import CompanyAccessCreate, CompanyAccessUpdate

class CompanyAccessService:
    def __init__(self):
        self.repository = CompanyAccessRepository()
        self.company_service = CompanyService()

    async def _ensure_company_exists(self, db: AsyncSession, company_id: int):
        await self.company_service.get_company(db, company_id)

    async def _validate_access_belongs_to_company(
        self, db: AsyncSession, company_id: int, access_id: int
    ) -> CompanyAccess:
        access = await self.repository.get_by_id(db, access_id)
        if not access:
            raise NotFoundException("Company access", access_id)
        
        if access.company_id != company_id:
            raise ValidationException("Access does not belong to company")
        
        return access

    async def list_accesses_by_company(self, db: AsyncSession, company_id: int) -> list[CompanyAccess]:
        await self._ensure_company_exists(db, company_id)

        return await self.repository.get_all_by_company(db, company_id)
    
    async def get_company_worker_id(self, db: AsyncSession, company_id: int) -> str:
        await self._ensure_company_exists(db, company_id)

        accesses = await self.list_accesses_by_company(db, company_id)
        first_access = accesses[0] if accesses else None
        if not first_access:
            raise NotFoundException("Company access", f"No active access found for company {company_id}")
        
        return first_access.lexobot_worker_api_key

    async def get_access(self, db: AsyncSession, company_id: int, access_id: int) -> CompanyAccess:
        await self._ensure_company_exists(db, company_id)

        return await self._validate_access_belongs_to_company(db, company_id, access_id)

    async def create_access(self, db: AsyncSession, company_id: int, obj_in: CompanyAccessCreate) -> CompanyAccess:
        await self._ensure_company_exists(db, company_id)
        
        if not self.is_expiration_after_acquisition(obj_in.issue_at, obj_in.expires_at):
            raise ValidationException("Acceso de la compañía debe ser posterior a la fecha de adquisición.")

        today_cr = get_cr_today_date()

        expiration_date = obj_in.expires_at.date() if hasattr(obj_in.expires_at, "date") else obj_in.expires_at

        if expiration_date <= today_cr:
            raise ValidationException("La fecha de vencimiento del plan debe ser posterior a la fecha actual.")

        db_obj = {
            **obj_in.model_dump(),
            "company_id": company_id,
            "lexobot_worker_api_key": str(uuid4()),
            "issue_at": obj_in.issue_at,
            "expires_at": obj_in.expires_at,
        }

        return await self.repository.create(db, db_obj)
    
    async def update_access(self, db: AsyncSession, company_id: int, access_id: int, obj_in: CompanyAccessUpdate) -> CompanyAccess:
        await self._ensure_company_exists(db, company_id)

        company_access = await self.get_access(db, company_id, access_id)
        
        if not self.is_expiration_after_acquisition(company_access.issue_at, obj_in.expires_at):
            raise ValidationException("Plan expiration date must be greater than acquisition date")

        return await self.repository.update(db, access_id, obj_in.dict(exclude_unset=True))

    async def delete_access(self, db: AsyncSession, company_id: int, access_id: int) -> bool:
        await self._ensure_company_exists(db, company_id)

        await self._validate_access_belongs_to_company(db, access_id, company_id)
        
        return await self.repository.delete(db, access_id)
    
    @staticmethod
    def is_expiration_after_acquisition(acquisition_date: datetime, expiration_date: datetime) -> bool:
        return expiration_date > acquisition_date
