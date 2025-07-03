from typing import List
from .base import BaseRepository
from sqlalchemy.orm import selectinload
from app.db.models import CompanyUser, User
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import and_, select, delete, exists

class CompanyUserRepository(BaseRepository[CompanyUser]):
    def __init__(self):
        super().__init__(CompanyUser, relationships=["user", "company"])

    async def get_all_by_company(self, db: AsyncSession, company_id: int) -> List[CompanyUser]:
        stmt = (
            select(CompanyUser)
            .options(selectinload(CompanyUser.user), selectinload(CompanyUser.company))
            .join(CompanyUser.user)
            .where(
                and_(
                    CompanyUser.company_id == company_id,
                    CompanyUser.is_active == True,
                    User.role_id == 2,
                )
            )
        )

        result = await db.execute(stmt)
        return result.scalars().all()
    
    async def get_all_by_user(self, db: AsyncSession, user_id: int) -> List[CompanyUser]:
        stmt = select(CompanyUser).where(
            and_(
                CompanyUser.user_id == user_id,
                CompanyUser.is_active == True,
                CompanyUser.assign == True
            )
        )
        stmt = self._add_relationships_to_query(stmt)

        result = await db.execute(stmt)
        return result.scalars().all()
    
    async def company_user_exists(self, db, company_id, user_id):
        stmt = select(exists().where(
            and_(
                CompanyUser.company_id == company_id,
                CompanyUser.user_id == user_id,
                CompanyUser.is_active == True
            )
        ))
        result = await db.execute(stmt)
        return result.scalar()
    
    async def bulk_create(self, db, objects):
        objs = [CompanyUser(**obj) for obj in objects]
        db.add_all(objs)
    
    async def delete_all_by_company(self, db: AsyncSession, company_id: int) -> None:
        stmt = delete(CompanyUser).where(
            and_(
                CompanyUser.company_id == company_id,
            )
        )
        await db.execute(stmt)