from typing import Optional
from .base import BaseRepository
from app.db.models import Role, User
from sqlalchemy import select, exists, and_
from sqlalchemy.ext.asyncio import AsyncSession

class RoleRepository(BaseRepository[Role]):
    def __init__(self):
        super().__init__(Role)

    async def get_by_name(self, db: AsyncSession, name: str) -> Optional[Role]:
        stmt = select(Role).where(Role.name == name, Role.is_active == True)
        result = await db.execute(stmt)
        return result.scalar_one_or_none()

    async def has_active_users(self, db: AsyncSession, role_id: int) -> bool:
        stmt = select(exists().where(
            and_(
                User.role_id == role_id,
                User.is_active == True
            )
        ))
        result = await db.execute(stmt)
        return result.scalar()
