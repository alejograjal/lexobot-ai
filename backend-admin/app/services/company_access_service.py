import calendar
from uuid import uuid4
from app.db.models import CompanyAccess
from .company_service import CompanyService
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime, timedelta, timezone
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

    async def get_access(self, db: AsyncSession, company_id: int, access_id: int) -> CompanyAccess:
        await self._ensure_company_exists(db, company_id)

        return await self._validate_access_belongs_to_company(db, access_id, company_id)

    async def create_access(self, db: AsyncSession, company_id: int, obj_in: CompanyAccessCreate) -> CompanyAccess:
        await self._ensure_company_exists(db, company_id)
        
        now = datetime.now(timezone.utc)
        
        year, month = obj_in.plan_acquisition_date.year, obj_in.plan_acquisition_date.month
        last_day = calendar.monthrange(year, month)[1]
        plan_expiration_date = obj_in.plan_acquisition_date.replace(day=last_day)

        db_obj = {
            **obj_in.model_dump(),
            "company_id": company_id,
            "openai_api_key": str(uuid4()),
            "issue_at": now,
            "expires_at": now + timedelta(days=365 * 5),
            "plan_expiration_date": plan_expiration_date,
        }

        return await self.repository.create(db, db_obj)
    
    async def update_access(self, db: AsyncSession, company_id: int, access_id: int, obj_in: CompanyAccessUpdate) -> CompanyAccess:
        await self._ensure_company_exists(db, company_id)

        await self._validate_access_belongs_to_company(db, access_id, company_id)
        
        if not self.is_last_day_of_month(obj_in.plan_expiration_date):
            raise ValidationException("Plan expiration date must be the last day of the month")

        return await self.repository.update(db, access_id, {"plan_expiration_date": obj_in.plan_expiration_date})

    async def delete_access(self, db: AsyncSession, company_id: int, access_id: int) -> bool:
        await self._ensure_company_exists(db, company_id)

        await self._validate_access_belongs_to_company(db, access_id, company_id)
        
        return await self.repository.delete(db, access_id)
    
    @staticmethod
    def is_last_day_of_month(date: datetime) -> bool:
        return date.day == calendar.monthrange(date.year, date.month)[1]        
