from .base import BaseRepository
from typing import Optional, List
from sqlalchemy.orm import selectinload
from sqlalchemy import select, exists, and_
from app.db.models import Plan, CompanyAccess
from sqlalchemy.ext.asyncio import AsyncSession

class PlanRepository(BaseRepository[Plan]):
    def __init__(self):
        super().__init__(Plan, relationships=["plan_category"])

    async def get_all(self, db: AsyncSession, include_inactive: bool = False) -> List[Plan]:
        stmt = select(self.model).options(
            selectinload(self.model.plan_category)
        )
        if not include_inactive:
            stmt = stmt.where(self.model.is_active == True)
        result = await db.execute(stmt)
        return result.scalars().all()

    async def get_by_name_and_category(self, db: AsyncSession, name: str, plan_category_id: int) -> Optional[Plan]:
        stmt = select(Plan).where(
            and_(
                Plan.name == name,
                Plan.plan_category_id == plan_category_id,
                Plan.is_active == True
            )
        ).options(
            selectinload(self.model.plan_category)
        )
        result = await db.execute(stmt)
        return result.scalar_one_or_none()

    async def has_active_company_access(self, db: AsyncSession, plan_id: int) -> bool:
        stmt = select(exists().where(
            and_(
                CompanyAccess.plan_id == plan_id,
                CompanyAccess.is_active == True
            )
        ))
        result = await db.execute(stmt)
        return result.scalar()