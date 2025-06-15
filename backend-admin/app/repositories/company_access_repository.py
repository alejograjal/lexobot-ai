from typing import List
from .base import BaseRepository
from sqlalchemy import select, and_
from sqlalchemy.orm import joinedload
from app.db.models import CompanyAccess
from sqlalchemy.ext.asyncio import AsyncSession

class CompanyAccessRepository(BaseRepository[CompanyAccess]):
    def __init__(self):
        super().__init__(CompanyAccess, relationships=["company", "plan", "plan.plan_category"])

    async def get_all_by_company(self, db: AsyncSession, company_id: int) -> List[CompanyAccess]:
        """
        Get all active access records for a specific company
        """
        stmt = select(self.model).where(
            and_(
                self.model.company_id == company_id,
                self.model.is_active == True
            )
        )
        stmt = self._add_relationships_to_query(stmt)
        
        result = await db.execute(stmt)
        return result.scalars().all()
