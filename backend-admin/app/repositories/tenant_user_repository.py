from typing import List
from .base import BaseRepository
from sqlalchemy.orm import selectinload
from app.db.models import TenantUser, User
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete, and_, exists

class TenantUserRepository(BaseRepository[TenantUser]):
    def __init__(self):
        super().__init__(TenantUser, relationships=["user", "tenant"])

    async def get_all_by_tenant(self, db: AsyncSession, tenant_id: int) -> List[TenantUser]:
        stmt = (
            select(TenantUser)
            .options(selectinload(TenantUser.user), selectinload(TenantUser.tenant))
            .join(TenantUser.user)
            .where(
                and_(
                    TenantUser.tenant_id == tenant_id,
                    TenantUser.is_active == True,
                    User.role_id == 3
                )
            )
        )

        result = await db.execute(stmt)
        return result.scalars().all()
    
    async def get_all_by_user(self, db: AsyncSession, user_id: int) -> List[TenantUser]:
        stmt = select(self.model).where(
            and_(
                TenantUser.user_id == user_id,
                TenantUser.is_active == True
            )
        )
        stmt = self._add_relationships_to_query(stmt)

        result = await db.execute(stmt)
        return result.scalars().all()
    
    async def tenant_user_exists(self, db, tenant_id, user_id):
        stmt = select(exists().where(
            and_(
                TenantUser.tenant_id == tenant_id,
                TenantUser.user_id == user_id,
                TenantUser.is_active == True
            )
        ))
        result = await db.execute(stmt)
        return result.scalar()
    
    async def bulk_create(self, db, objects):
        objs = [TenantUser(**obj) for obj in objects]
        db.add_all(objs)

    async def delete_all_by_tenant(self, db: AsyncSession, tenant_id: int) -> None:
        stmt = delete(TenantUser).where(
            and_(
                TenantUser.tenant_id == tenant_id,
            )
        )
        await db.execute(stmt)

