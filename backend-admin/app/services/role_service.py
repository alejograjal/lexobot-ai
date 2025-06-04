from typing import List
from app.db.models import Role
from app.repositories import RoleRepository
from app.schemas import RoleCreate, RoleUpdate
from sqlalchemy.ext.asyncio import AsyncSession
from app.core import NotFoundException, ValidationException, DuplicateEntryError

class RoleService:
    def __init__(self):
        self.repository = RoleRepository()

    async def create_role(self, db: AsyncSession, data: RoleCreate) -> Role:
        existing = await self.repository.get_by_name(db, data.name)
        if existing:
            raise DuplicateEntryError(f"Role", "name")
    
        return await self.repository.create(db, data.dict())

    async def get_role(self, db: AsyncSession, role_id: int, include_inactive: bool = False) -> Role:
        role = await self.repository.get_by_id(db, role_id, include_inactive)
        if not role:
            raise NotFoundException("Role", role_id)
        
        return role

    async def get_all_roles(self, db: AsyncSession, include_inactive: bool = False) -> List[Role]:
        return await self.repository.get_all(db, include_inactive)

    async def update_role(self, db: AsyncSession, role_id: int, data: RoleUpdate) -> Role:
        role = await self.repository.get_by_id(db, role_id)
        if not role:
            raise NotFoundException("Role", role_id)
        
        if data.name and data.name != role.name:
            existing = await self.repository.get_by_name(db, data.name)
            if existing:
                raise DuplicateEntryError(f"Role", "name")
        
        return await self.repository.update(db, role_id, data.dict(exclude_unset=True))

    async def delete_role(self, db: AsyncSession, role_id: int) -> bool:
        if not await self.repository.exists(db, role_id):
            raise NotFoundException("Role", role_id)
        
        if await self.repository.has_active_users(db, role_id):
            raise ValidationException("Cannot delete role with active users assigned")
        
        return await self.repository.delete(db, role_id)
