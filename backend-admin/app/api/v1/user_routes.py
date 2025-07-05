from app.db import get_db
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import APIRouter, Depends, status, Query
from app.core import require_company_or_admin, require_any_role
from app.services import UserService, CompanyUserService, TenantUserService
from app.schemas import UserCreate, UserUpdate, UserResponse, common_errors, not_found_error, validation_error, duplicate_entry_error

router = APIRouter(
    prefix="/users",
    tags=["Users"],
    dependencies=[Depends(require_company_or_admin)]
)

user_service = UserService()
company_user = CompanyUserService()
tenant_user = TenantUserService()

@router.get("", response_model=List[UserResponse], responses={**common_errors})
async def get_users(
    role_id: Optional[int] = Query(None, alias="role_id"),
    db: AsyncSession = Depends(get_db)
) -> List[UserResponse]:
    """Get all users"""
    return await user_service.get_all(db, role_id)

@router.get("/{user_id}/companies", response_model=UserResponse, responses={**common_errors})
async def get_user_companies(user_id: int, db: AsyncSession = Depends(get_db)):
    return await company_user.get_all_by_user(db, user_id)

@router.get("/{user_id}/tenants", response_model=UserResponse, responses={**common_errors})
async def get_user_tenants(user_id: int, db: AsyncSession = Depends(get_db)):
    return await tenant_user.get_all_by_user(db, user_id)

@router.post("", response_model=UserResponse, status_code=status.HTTP_201_CREATED, responses={
    **common_errors,
    **validation_error,
    **duplicate_entry_error
})
async def create_user(
    user_data: UserCreate,
    db: AsyncSession = Depends(get_db)
) -> UserResponse:
    """Create a new user"""
    return await user_service.create_user(db, user_data)

@router.get("/{user_id}", response_model=UserResponse, dependencies=[Depends(require_any_role)], responses={
    **common_errors,
    **not_found_error
})
async def get_user(
    user_id: int,
    db: AsyncSession = Depends(get_db)
) -> UserResponse:
    """Get a user by ID"""
    return await user_service.get_by_id(db, user_id)

@router.patch("/{user_id}", response_model=UserResponse, responses={
    **common_errors,
    **not_found_error,
    **validation_error,
    **duplicate_entry_error
})
async def update_user(
    user_id: int,
    user_data: UserUpdate,
    db: AsyncSession = Depends(get_db)
) -> UserResponse:
    """Update a user"""
    return await user_service.update_user(db, user_id, user_data)

@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT, responses={
    **common_errors,
    **not_found_error,
    **validation_error
})
async def delete_user(
    user_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Soft delete a user"""
    await user_service.delete_user(db, user_id)
    return None
