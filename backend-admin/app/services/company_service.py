from typing import List, Optional
from app.db.models import Company
from app.repositories import CompanyRepository
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas import CompanyCreate, CompanyUpdate
from app.core import DuplicateEntryError, NotFoundException

class CompanyService:
    def __init__(self):
        self.repository = CompanyRepository()

    async def _ensure_unique_fields(
        self, db: AsyncSession, company_data: CompanyCreate | CompanyUpdate, company_id: Optional[int] = None
    ):
        for field_name, getter in [
            ("legal_id", self.repository.get_by_legal_id),
            ("email", self.repository.get_by_email),
            ("billing_email", self.repository.get_by_billing_email),
        ]:
            value = getattr(company_data, field_name, None)
            if value:
                existing = await getter(db, value)
                if existing and (company_id is None or existing.id != company_id):
                    raise DuplicateEntryError("Company", field_name)

    async def create_company(self, db: AsyncSession, company_data: CompanyCreate) -> Company:
        await self._ensure_unique_fields(db, company_data)

        return await self.repository.create(db, company_data.dict())

    async def get_company(self, db: AsyncSession, company_id: int, include_inactive: bool = False) -> Company:
        company = await self.repository.get_by_id(db, company_id, include_inactive)
        if not company:
            raise NotFoundException("Company", company_id)
        return company

    async def get_companies(self, db: AsyncSession, include_inactive: bool = False) -> List[Company]:
        return await self.repository.get_all(db, include_inactive)

    async def update_company(self, db: AsyncSession, company_id: int, company_data: CompanyUpdate) -> Company:
        if not await self.repository.exists(db, company_id):
            raise NotFoundException("Company", company_id)
        
        await self._ensure_unique_fields(db, company_data, company_id) 
        
        company = await self.repository.update(db, company_id, company_data.dict(exclude_unset=True))
        if not company:
            raise NotFoundException("Company", company_id)
        return company
    
    async def _update_managed_tenants_count_direct(self, db: AsyncSession, company_id: int, count: int):
        await self.repository.update(db, company_id, {"managed_tenants_count": count})

    async def delete_company(self, db: AsyncSession, company_id: int) -> bool:
        if not await self.repository.exists(db, company_id):
            raise NotFoundException("Company", company_id)
        
        return await self.repository.delete(db, company_id)