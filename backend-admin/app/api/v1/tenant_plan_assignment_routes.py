from typing import List
from app.db import get_db
from app.core import require_administrator
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.services import TenantPlanAssignmentService
from app.schemas import (
    TenantPlanAssignmentCreate,
    TenantPlanAssignmentUpdate,
    TenantPlanAssignmentResponse,
    common_errors,
    not_found_error,
    validation_error,
)

router = APIRouter(
    prefix="/tenants/{tenant_id}/plans",
    tags=["Tenant Plan Assignments"],
    dependencies=[Depends(require_administrator)],
)

service = TenantPlanAssignmentService()

@router.get("", response_model=List[TenantPlanAssignmentResponse], responses={
    **common_errors,
    **not_found_error,
})
async def list_plan_assignments(tenant_id: int, db: AsyncSession = Depends(get_db)):
    return await service.list_by_tenant(db, tenant_id)

@router.get("/{assignment_id}", response_model=TenantPlanAssignmentResponse, status_code=status.HTTP_200_OK, responses={
    **common_errors,
    **not_found_error,
    **validation_error,
})
async def get_plan_assignment(
    tenant_id: int,
    assignment_id: int,
    db: AsyncSession = Depends(get_db),
) -> TenantPlanAssignmentResponse:
    return await service.get(db, tenant_id, assignment_id)

@router.post("", response_model=TenantPlanAssignmentResponse, status_code=status.HTTP_201_CREATED, responses={
    **common_errors,
    **not_found_error,
    **validation_error,
})
async def create_plan_assignment(
    tenant_id: int, payload: TenantPlanAssignmentCreate, db: AsyncSession = Depends(get_db)
):
    return await service.create(db, tenant_id, payload)

@router.patch("/{assignment_id}", response_model=TenantPlanAssignmentResponse, responses={
    **common_errors,
    **not_found_error,
    **validation_error,
})
async def update_plan_assignment(
    tenant_id: int, assignment_id: int, payload: TenantPlanAssignmentUpdate, db: AsyncSession = Depends(get_db)
):
    return await service.update(db, tenant_id, assignment_id, payload)

@router.delete("/{assignment_id}", status_code=status.HTTP_204_NO_CONTENT, responses={
    **common_errors,
    **not_found_error,
    **validation_error,
})
async def delete_plan_assignment(tenant_id: int, assignment_id: int, db: AsyncSession = Depends(get_db)):
    await service.delete(db, tenant_id, assignment_id)
    return None
