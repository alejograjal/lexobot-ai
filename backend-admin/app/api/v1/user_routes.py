from app.db import get_db
from typing import List
from app.services import UserService
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas import UserCreate, UserUpdate, UserResponse
from app.core import require_company_or_admin, require_any_role

router = APIRouter(
    prefix="/users",
    tags=["Users"],
    dependencies=[Depends(require_company_or_admin)]
)

user_service = UserService()

@router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def create_user(
    user_data: UserCreate,
    db: AsyncSession = Depends(get_db)
) -> UserResponse:
    """Create a new user"""
    return await user_service.create_user(db, user_data)

@router.get("/{user_id}", response_model=UserResponse, dependencies=[Depends(require_any_role)])
async def get_user(
    user_id: int,
    db: AsyncSession = Depends(get_db)
) -> UserResponse:
    """Get a user by ID"""
    return await user_service.get_by_id(db, user_id)

@router.get("/", response_model=List[UserResponse])
async def get_users(
    db: AsyncSession = Depends(get_db)
) -> List[UserResponse]:
    """Get all users"""
    return await user_service.repository.get_all(db)

@router.patch("/{user_id}", response_model=UserResponse)
async def update_user(
    user_id: int,
    user_data: UserUpdate,
    db: AsyncSession = Depends(get_db)
) -> UserResponse:
    """Update a user"""
    return await user_service.update_user(db, user_id, user_data)

@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(
    user_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Soft delete a user"""
    await user_service.delete_user(db, user_id)
    return None
