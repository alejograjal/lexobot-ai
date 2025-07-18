from .base import BaseRepository
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import exists, select, not_, and_
from app.db.models import Tenant, CompanyTenantAssignment

class TenantRepository(BaseRepository[Tenant]):
    def __init__(self):
        super().__init__(Tenant)

    async def get_available_for_company(self, db: AsyncSession, assigned_ids: List[int]) -> List[Tenant]:
        stmt = select(Tenant).where(not_(Tenant.id.in_(assigned_ids)), and_(Tenant.is_active == True))
        result = await db.execute(stmt)

        return result.scalars().all()

    async def get_by_name(self, db: AsyncSession, name: str) -> Optional[Tenant]:
        stmt = select(self.model).where(self.model.name == name, self.model.is_active == True)
        result = await db.execute(stmt)
        return result.scalar_one_or_none()
    
    async def get_by_contact_email(self, db: AsyncSession, email: str) -> Optional[Tenant]:
        stmt = select(self.model).where(self.model.contact_email == email, self.model.is_active == True)
        result = await db.execute(stmt)
        return result.scalar_one_or_none()

    async def get_by_external_id(self, db: AsyncSession, external_id: str) -> Optional[Tenant]:
        stmt = select(self.model).where(self.model.external_id == external_id, self.model.is_active == True)
        result = await db.execute(stmt)
        return result.scalar_one_or_none()
    
    async def has_company_assignments(self, db: AsyncSession, tenant_id: int) -> bool:
        stmt = select(exists().where(
            CompanyTenantAssignment.tenant_id == tenant_id
        ))
        result = await db.execute(stmt)
        return result.scalar()
