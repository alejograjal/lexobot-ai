from typing import List
from app.db import get_db
from fastapi import APIRouter, Depends
from app.core import require_administrator
from app.services import PlanCategoryService
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas import PlanCategoryCreate, PlanCategoryUpdate, PlanCategoryResponse, common_errors, not_found_error, validation_error

router = APIRouter(
    prefix="/plan-categories",
    tags=["Plan Categories"],
    dependencies=[Depends(require_administrator)]
)

service = PlanCategoryService()

@router.post("", response_model=PlanCategoryResponse, responses={**common_errors})
async def create_plan_category(payload: PlanCategoryCreate, db: AsyncSession = Depends(get_db)):
    return await service.create(db, payload)

@router.get("", response_model=List[PlanCategoryResponse], responses={**common_errors})
async def get_all_plan_categories(db: AsyncSession = Depends(get_db)):
    return await service.get_all(db)

@router.get("/{category_id}", response_model=PlanCategoryResponse, responses={
    **common_errors,
    **not_found_error
})
async def get_plan_category(category_id: int, db: AsyncSession = Depends(get_db)):
    return await service.get_by_id(db, category_id)

@router.patch("/{category_id}", response_model=PlanCategoryResponse, responses={
    **common_errors,
    **not_found_error
})
async def update_plan_category(category_id: int, payload: PlanCategoryUpdate, db: AsyncSession = Depends(get_db)):
    return await service.update(db, category_id, payload)

@router.delete("/{category_id}", response_model=bool, responses={
    **common_errors,
    **not_found_error,
    **validation_error
})
async def delete_plan_category(category_id: int, db: AsyncSession = Depends(get_db)):
    await service.delete(db, category_id)
    return None
