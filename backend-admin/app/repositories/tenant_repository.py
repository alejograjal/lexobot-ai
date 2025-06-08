from typing import Optional
from .base import BaseRepository
from sqlalchemy import exists, select
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.models import Tenant, CompanyTenantAssignment

class TenantRepository(BaseRepository[Tenant]):
    def __init__(self):
        super().__init__(Tenant)

    async def get_by_name(self, db: AsyncSession, name: str) -> Optional[Tenant]:
        stmt = select(self.model).where(self.model.name == name, self.model.is_active == True)
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
