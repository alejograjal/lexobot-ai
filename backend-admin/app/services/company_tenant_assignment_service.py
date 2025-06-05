from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.models import CompanyTenantAssignment
from app.repositories import CompanyTenantAssignmentRepository
from app.core import DuplicateEntryError, NotFoundException, ValidationException
from app.schemas import CompanyTenantAssignmentCreate, CompanyTenantAssignmentBulkSync

class CompanyTenantAssignmentService:
    def __init__(self):
        self.repository = CompanyTenantAssignmentRepository()

    async def create(self, db: AsyncSession, dto: CompanyTenantAssignmentCreate):
        if await self.repo.exists(db, dto.company_id, dto.tenant_id):
            raise DuplicateEntryError("Company tenant assignment", "company_id and tenant_id")
        return await self.repo.create(db, dto.dict())

    async def delete(self, db: AsyncSession, company_tenant_assignment_id: int):
        if not await self.repo.exists(db, company_tenant_assignment_id):
            raise NotFoundException(f"Company tenant assignment", company_tenant_assignment_id)
        await self.repo.delete(db, company_tenant_assignment_id)

    async def bulk_sync(
        self,
        db: AsyncSession,
        dto: CompanyTenantAssignmentBulkSync
    ) -> List[CompanyTenantAssignment]:
        """
        Sync all tenant assignments for a company in a single transaction.
        Removes existing assignments and creates new ones atomically.
        """
        if not CompanyTenantAssignmentBulkSync.tenant_ids:
            raise ValidationException("Document list cannot be empty")

        async with self.repository.transaction(db) as session:
            existing_assignments = await self.repository.get_by_company(session, dto.company_id)
            for assignment in existing_assignments:
                await self.repository.remove(session, assignment.id)

            if dto.tenant_ids:
                assignments = [
                    {"company_id": dto.company_id, "tenant_id": tid}
                    for tid in dto.tenant_ids
                ]
                new_assignments = await self.repository.bulk_create(session, assignments)
                return new_assignments
            
            return []
