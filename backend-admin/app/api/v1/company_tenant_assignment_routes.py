from typing import List
from app.db import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas import CompanyTenantAssignmentResponse
from app.services import CompanyTenantAssignmentService
from app.core import require_administrator, require_any_role
from fastapi import APIRouter, Depends, status, Query, Response
from app.schemas import CompanyTenantAssignmentCreate, CompanyTenantAssignmentBulkSync, common_errors, duplicate_entry_error, not_found_error, validation_error

router = APIRouter(
    prefix="/company-tenant-assignments",
    tags=["Company Tenant Assignments"]
)

company_tenant_assignment_service = CompanyTenantAssignmentService()

@router.get("", response_model=List[CompanyTenantAssignmentResponse], dependencies=[Depends(require_any_role)], responses={**common_errors})
async def get_all_assignments_by_company(company_id: int = Query(...), db: AsyncSession = Depends(get_db)):
    """Get all company-tenant assignments"""
    return await company_tenant_assignment_service.get_all_by_company(db, company_id)

@router.post("", status_code=status.HTTP_201_CREATED, response_model=CompanyTenantAssignmentResponse, dependencies=[Depends(require_administrator)], responses={
    **common_errors,
    **duplicate_entry_error,
})
async def create_assignment(
    assignment_data: CompanyTenantAssignmentCreate,
    db: AsyncSession = Depends(get_db)
):
    """Create a new company-tenant assignment"""
    return await company_tenant_assignment_service.create(db, assignment_data)

@router.delete("/{assignment_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(require_administrator)], responses={**common_errors,**not_found_error})
async def delete_assignment(assignment_id: int, db: AsyncSession = Depends(get_db)):
    """Delete a specific company-tenant assignment"""
    await company_tenant_assignment_service.delete(db, assignment_id)
    return None

@router.put("/bulk-sync", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(require_administrator)], responses={
    **common_errors,
    **validation_error
})
async def bulk_sync_assignments(
    bulk_data: CompanyTenantAssignmentBulkSync,
    db: AsyncSession = Depends(get_db)
):
    """Synchronize all assignments for a company"""
    await company_tenant_assignment_service.bulk_sync(db, bulk_data)
    return None

@router.post(
    "/{assignment_id}/build-vectorstore",
    status_code=status.HTTP_200_OK,
    dependencies=[Depends(require_any_role)],
    responses={
        **common_errors,
        **not_found_error
    }
)
async def build_vectorstore_for_assignment(
    assignment_id: int,
    db: AsyncSession = Depends(get_db)
):
    """
    Trigger vectorstore building for a company-tenant assignment
    """
    await company_tenant_assignment_service.build_vectorstore_for_assignment(db, assignment_id)
    return Response(status_code=status.HTTP_200_OK)