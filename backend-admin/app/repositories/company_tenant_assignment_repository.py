from typing import List
from .base import BaseRepository
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import and_, delete, select, func
from app.db.models import CompanyTenantAssignment

class CompanyTenantAssignmentRepository(BaseRepository[CompanyTenantAssignment]):
    def __init__(self):
        super().__init__(CompanyTenantAssignment, relationships=["tenant", "company"])

    async def count_by_company(self, db: AsyncSession, company_id: int) -> int:
        stmt = select(func.count()).select_from(CompanyTenantAssignment).where(
            CompanyTenantAssignment.company_id == company_id,
            CompanyTenantAssignment.is_active == True
        )
        result = await db.execute(stmt)
        count = result.scalar_one()
        return count

    async def get_all_by_company(self, db: AsyncSession, company_id: int) -> List[CompanyTenantAssignment]:
        stmt = select(self.model).where(
            and_(
                CompanyTenantAssignment.company_id == company_id,
                CompanyTenantAssignment.is_active == True
            )
        )
        stmt = self._add_relationships_to_query(stmt)

        result = await db.execute(stmt)
        return result.scalars().all()
    
    async def get_assigned_tenant_ids(self, db: AsyncSession, company_id: int) -> List[int]:
        subquery = (
            select(CompanyTenantAssignment.tenant_id)
            .where(and_(CompanyTenantAssignment.company_id == company_id, CompanyTenantAssignment.is_active == True))
        )
        assigned_ids = await db.execute(subquery)
        return assigned_ids.scalars().all()

    async def delete_all_by_company(self, db: AsyncSession, company_id: int) -> None:
        stmt = delete(CompanyTenantAssignment).where(
            CompanyTenantAssignment.company_id == company_id
        )
        await db.execute(stmt)

    async def bulk_create(self, db: AsyncSession, items: List[dict]) -> None:
        objs = [CompanyTenantAssignment(**item) for item in items]
        db.add_all(objs)
