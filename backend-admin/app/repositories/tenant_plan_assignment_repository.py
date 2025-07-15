from typing import List
from .base import BaseRepository
from sqlalchemy import select, and_
from app.db.models import TenantPlanAssignment
from sqlalchemy.ext.asyncio import AsyncSession

class TenantPlanAssignmentRepository(BaseRepository[TenantPlanAssignment]):
    def __init__(self):
        super().__init__(TenantPlanAssignment, relationships=["plan", "plan.plan_category"])

    async def get_all_by_tenant(self, db: AsyncSession, tenant_id: int) -> List[TenantPlanAssignment]:
        stmt = select(self.model).where(and_(
            self.model.tenant_id == tenant_id,
            self.model.is_active == True
        ))
        stmt = self._add_relationships_to_query(stmt)
            
        result = await db.execute(stmt)
        return result.scalars().all()