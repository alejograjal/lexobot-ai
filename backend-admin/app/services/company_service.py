from typing import List, Optional
from app.db.models import Company
from app.repositories import CompanyRepository
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas import CompanyCreate, CompanyUpdate
from app.core import DuplicateEntryError, NotFoundException

class CompanyService:
    def __init__(self):
        self.repository = CompanyRepository()

    async def create_company(self, db: AsyncSession, company_data: CompanyCreate) -> Company:
        if await self.repository.get_by_legal_id(db, company_data.legal_id):
            raise DuplicateEntryError("Company", "legal_id")
        
        if await self.repository.get_by_email(db, company_data.email):
            raise DuplicateEntryError("Company", "email")
        
        if await self.repository.get_by_billing_email(db, company_data.billing_email):
            raise DuplicateEntryError("Company", "billing_email")

        return await self.repository.create(db, company_data.dict())

    async def get_company(self, db: AsyncSession, company_id: int, include_inactive: bool = False) -> Optional[Company]:
        company = await self.repository.get_by_id(db, company_id, include_inactive)
        if not company:
            raise NotFoundException(f"Company access", company_id)
        return company

    async def get_companies(self, db: AsyncSession, include_inactive: bool = False) -> List[Company]:
        return await self.repository.get_all(db, include_inactive)

    async def update_company(self, db: AsyncSession, company_id: int, company_data: CompanyUpdate) -> Optional[Company]:
        if not await self.repository.exists(db, company_id):
            raise NotFoundException(f"Company", company_id)
        
        if company_data.legal_id:
            existing = await self.repository.get_by_legal_id(db, company_data.legal_id)
            if existing and existing.id != company_id:
                raise DuplicateEntryError("Company", "legal_id")
        
        if company_data.email:
            existing = await self.repository.get_by_email(db, company_data.email)
            if existing and existing.id != company_id:
                raise DuplicateEntryError("Company", "email")
        
        if company_data.billing_email:
            existing = await self.repository.get_by_billing_email(db, company_data.billing_email)
            if existing and existing.id != company_id:
                raise DuplicateEntryError("Company", "billing_email")
        
        company = await self.repository.update(db, company_id, company_data.dict(exclude_unset=True))
        if not company:
            raise NotFoundException("Company", company_id)
        return company

    async def delete_company(self, db: AsyncSession, company_id: int) -> bool:
        if not await self.repository.exists(db, company_id):
            raise NotFoundException(f"Company", company_id)
        
        return await self.repository.delete(db, company_id)