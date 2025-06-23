from typing import List
from .company_service import CompanyService
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.models import CompanyTenantAssignment
from .company_access_service import CompanyAccessService
from app.clients.tenant_api_client import TenantApiClient
from app.repositories import CompanyTenantAssignmentRepository
from app.core import DuplicateEntryError, NotFoundException, AppException
from app.schemas import CompanyTenantAssignmentCreate, CompanyTenantAssignmentBulkSync

class CompanyTenantAssignmentService:
    def __init__(self):
        self.repository = CompanyTenantAssignmentRepository()
        self.company_service = CompanyService()
        self.company_access_service = CompanyAccessService()
        self.tenant_api_client = TenantApiClient()

    async def get_all_by_company(self, db: AsyncSession, company_id: int) -> List[CompanyTenantAssignment]:
        return await self.repository.get_all_by_company(db, company_id)
    
    async def get_assigned_tenant_ids(self, db: AsyncSession, company_id: int) -> List[int]:
        return await self.repository.get_assigned_tenant_ids(db, company_id)
    
    async def get_company_id_by_tenant_id(self, db: AsyncSession, tenant_id: int) -> int | None:
        company_id = await self.repository.get_company_id_by_tenant_id(db, tenant_id)
        if company_id is None:
            raise NotFoundException("Company tenant assignment for tenant", tenant_id)
        
        return company_id

    async def create(self, db: AsyncSession, dto: CompanyTenantAssignmentCreate):
        async with db.begin():
            if await self.repository.exists(db, dto.company_id, dto.tenant_id):
                raise DuplicateEntryError("Company tenant assignment", "company_id and tenant_id")
            
            result = await self.repository.create(db, dto.dict())
            await self._update_managed_tenants_count(db, dto.company_id)
            return result

    async def delete(self, db: AsyncSession, company_tenant_assignment_id: int):
        async with db.begin():
            assignment = await self.repository.get_by_id(db, company_tenant_assignment_id)
            if not assignment:
                raise NotFoundException("Company tenant assignment", company_tenant_assignment_id)

            await self.repository.delete(db, company_tenant_assignment_id)
            await self._update_managed_tenants_count(db, assignment.company_id)

    async def bulk_sync(
        self,
        db: AsyncSession,
        dto: CompanyTenantAssignmentBulkSync
    ) -> List[CompanyTenantAssignment]:
        """
        Sync all tenant assignments for a company in a single transaction.
        Removes existing assignments and creates new ones atomically.
        """
        async with db.begin():
            existing_assignments = await self.repository.get_all_by_company(db, dto.company_id)
            for assignment in existing_assignments:
                await self.repository.remove(db, assignment.id)

            new_assignments = []
            if dto.tenant_ids:
                assignments = [
                    {"company_id": dto.company_id, "tenant_id": tid}
                    for tid in dto.tenant_ids
                ]

                new_assignments = await self.repository.bulk_create(db, assignments)

            await self._update_managed_tenants_count(db, dto.company_id, len(dto.tenant_ids))

            return new_assignments
        
    async def _update_managed_tenants_count(self, db: AsyncSession, company_id: int, count: int):
        await self.company_service._update_managed_tenants_count_direct(db, company_id, count)

    async def build_vectorstore_for_assignment(self, db: AsyncSession, company_tenant_assignment_id: int):
        exists = await self.repository.exists(db, company_tenant_assignment_id)
        if not exists:
            raise NotFoundException("Company tenant assignment", company_tenant_assignment_id)
        
        tenant_assigned = await self.repository.get_by_id(db, company_tenant_assignment_id)
        company_worker_id = await self.company_access_service.get_company_worker_id(db, tenant_assigned.company_id)

        try:
            async with TenantApiClient() as client:
                await client.build_vectorstore(
                    company_access_id=str(company_worker_id),
                    external_id=str(tenant_assigned.tenant.external_id)
                )
        except Exception as e:
            raise AppException(
                detail=f"Se ha producido un error al construir el modelo. {str(e)}",
                status_code=500,
                error_code="VECTORSTORE_BUILD_ERROR"
            ) from e

