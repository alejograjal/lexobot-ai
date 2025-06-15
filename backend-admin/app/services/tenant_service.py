from typing import List
from typing import Optional
from app.db.models import Tenant
from app.repositories import TenantRepository
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas import TenantCreate, TenantUpdate
from app.core import NotFoundException, DuplicateEntryError, ValidationException

class TenantService:
    def __init__(self):
        self.repository = TenantRepository()

    async def _validate_tenant_data(
        self, 
        db: AsyncSession, 
        data: TenantCreate | TenantUpdate,
        tenant_id: Optional[int] = None
    ) -> None:
        if hasattr(data, 'name') and data.name:
            existing = await self.repository.get_by_name(db, data.name)
            if existing and (not tenant_id or existing.id != tenant_id):
                raise DuplicateEntryError("Tenant", "name")

        if hasattr(data, 'contact_email') and data.contact_email:
            existing_email = await self.repository.get_by_contact_email(db, data.contact_email)
            if existing_email and (not tenant_id or existing_email.id != tenant_id):
                raise DuplicateEntryError("Tenant", "contact_email")

        if hasattr(data, 'client_count') and data.client_count is not None:
            if data.client_count < 0:
                raise ValidationException("Client count cannot be negative")

        if hasattr(data, 'external_id') and data.external_id:
            existing_external_id = await self.repository.get_by_external_id(db, data.external_id)
            if existing_external_id and (not tenant_id or existing_external_id.id != tenant_id):
                raise DuplicateEntryError("Tenant", "external_id")

    async def create(self, db: AsyncSession, data: TenantCreate) -> Tenant:
        await self._validate_tenant_data(db, data)
        
        return await self.repository.create(db, data.dict())

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

        await self._validate_tenant_data(db, data, tenant_id)

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
