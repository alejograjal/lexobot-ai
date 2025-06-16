from typing import List
from app.db import get_db
from app.services import PlanService
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core import require_administrator, require_any_role
from app.schemas import PlanCreate, PlanUpdate, PlanResponse, common_errors, not_found_error, validation_error

router = APIRouter(
    prefix="/plans",
    tags=["Plans"],
    dependencies=[Depends(require_administrator)]
)

plan_service = PlanService()

@router.post("", response_model=PlanResponse, status_code=status.HTTP_201_CREATED, responses={
    **common_errors,
    **validation_error,
})
async def create_plan(
    plan_data: PlanCreate,
    db: AsyncSession = Depends(get_db)
) -> PlanResponse:
    """Create a new plan"""
    return await plan_service.create_plan(db, plan_data)

@router.get("/{plan_id}", response_model=PlanResponse, dependencies=[Depends(require_any_role)], responses={
    **common_errors,
    **not_found_error
})
async def get_plan(
    plan_id: int,
    include_inactive: bool = False,
    db: AsyncSession = Depends(get_db)
) -> PlanResponse:
    """Get a plan by ID"""
    return await plan_service.get_plan(db, plan_id, include_inactive)

@router.get("", response_model=List[PlanResponse], responses={**common_errors})
async def get_all_plans(
    include_inactive: bool = False,
    db: AsyncSession = Depends(get_db)
) -> List[PlanResponse]:
    """Get all plans"""
    return await plan_service.get_all_plans(db, include_inactive)

@router.patch("/{plan_id}", response_model=PlanResponse, responses={
    **common_errors,
    **not_found_error,
    **validation_error,
})
async def update_plan(
    plan_id: int,
    plan_data: PlanUpdate,
    db: AsyncSession = Depends(get_db)
) -> PlanResponse:
    """Update a plan"""
    return await plan_service.update_plan(db, plan_id, plan_data)

@router.delete("/{plan_id}", status_code=status.HTTP_204_NO_CONTENT, responses={
    **common_errors,
    **not_found_error,
    **validation_error,
})
async def delete_plan(
    plan_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Soft delete a plan"""
    await plan_service.delete_plan(db, plan_id)
    return None
