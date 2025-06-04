from typing import List
from .base import BaseRepository
from sqlalchemy import and_, delete
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.models import CompanyTenantAssignment

class CompanyTenantAssignmentRepository(BaseRepository[CompanyTenantAssignment]):
    def __init__(self):
        super().__init__(CompanyTenantAssignment)

    async def delete_all_by_company(self, db: AsyncSession, company_id: int) -> None:
        stmt = delete(CompanyTenantAssignment).where(
            CompanyTenantAssignment.company_id == company_id
        )
        await db.execute(stmt)
        await db.commit()

    async def bulk_create(self, db: AsyncSession, items: List[dict]) -> None:
        objs = [CompanyTenantAssignment(**item) for item in items]
        db.add_all(objs)
        await db.commit()
