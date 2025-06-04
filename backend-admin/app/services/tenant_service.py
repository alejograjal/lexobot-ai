import uuid
from typing import List
from app.db.models import Tenant
from app.repositories import TenantRepository
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas import TenantCreate, TenantUpdate
from app.core import NotFoundException, DuplicateEntryError, ValidationException

class TenantService:
    def __init__(self):
        self.repository = TenantRepository()

    async def create(self, db: AsyncSession, data: TenantCreate) -> Tenant:
        existing = await self.repository.get_by_name(db, data.name)
        if existing:
            raise DuplicateEntryError("Tenant", "name")
        return await self.repository.create(db, {**data.dict(), "external_id": uuid.uuid4()})

    async def get(self, db: AsyncSession, tenant_id: int, include_inactive: bool = False) -> Tenant:
        tenant = await self.repository.get_by_id(db, tenant_id, include_inactive)
        if not tenant:
            raise NotFoundException("Tenant", tenant_id)
        return tenant

    async def get_all(self, db: AsyncSession, include_inactive: bool = False) -> List[Tenant]:
        return await self.repository.get_all(db, include_inactive)

    async def update(self, db: AsyncSession, tenant_id: int, data: TenantUpdate) -> Tenant:
        if not await self.repository.exists(db, tenant_id):
            raise NotFoundException("Tenant", tenant_id)

        if data.name:
            existing = await self.repository.get_by_name(db, data.name)
            if existing and existing.id != tenant_id:
                raise DuplicateEntryError("Tenant", "name")

        tenant = await self.repository.update(db, tenant_id, data.dict(exclude_unset=True))
        if not tenant:
            raise NotFoundException("Tenant", tenant_id)
        return tenant

    async def delete(self, db: AsyncSession, tenant_id: int) -> bool:
        if not await self.repository.exists(db, tenant_id):
            raise NotFoundException("Tenant", tenant_id)
        
        if await self.repository.has_company_assignments(db, tenant_id):
            raise ValidationException("Cannot delete tenant with assigned companies")
        
        return await self.repository.delete(db, tenant_id)
