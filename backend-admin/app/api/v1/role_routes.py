from typing import List
from app.db import get_db
from app.services import RoleService
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core import require_administrator, require_company_or_admin
from app.schemas import RoleCreate, RoleUpdate, RoleResponse, common_errors, not_found_error, validation_error, duplicate_entry_error

router = APIRouter(
    prefix="/roles",
    tags=["Roles"]
)

role_service = RoleService()

@router.post("", response_model=RoleResponse, status_code=status.HTTP_201_CREATED, dependencies=[Depends(require_administrator)], responses={
    **common_errors,
    **validation_error,
    **duplicate_entry_error
})
async def create_role(role_data: RoleCreate, db: AsyncSession = Depends(get_db)) -> RoleResponse:
    """Create a new role"""
    return await role_service.create_role(db, role_data)

@router.get("/{role_id}", response_model=RoleResponse, dependencies=[Depends(require_administrator)], responses={
    **common_errors,
    **not_found_error
})
async def get_role(role_id: int, include_inactive: bool = False, db: AsyncSession = Depends(get_db)) -> RoleResponse:
    """Get role by ID"""
    return await role_service.get_role(db, role_id, include_inactive)

@router.get("", response_model=List[RoleResponse], responses={**common_errors}, dependencies=[Depends(require_company_or_admin)])
async def get_all_roles(include_inactive: bool = False, db: AsyncSession = Depends(get_db)) -> List[RoleResponse]:
    """List all roles"""
    return await role_service.get_all_roles(db, include_inactive)

@router.patch("/{role_id}", response_model=RoleResponse, dependencies=[Depends(require_administrator)], responses={
    **common_errors,
    **not_found_error,
    **validation_error,
    **duplicate_entry_error
})
async def update_role(role_id: int, role_data: RoleUpdate, db: AsyncSession = Depends(get_db)) -> RoleResponse:
    """Update a role"""
    return await role_service.update_role(db, role_id, role_data)

@router.delete("/{role_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(require_administrator)], responses={
    **common_errors,
    **not_found_error,
    **validation_error
})
async def delete_role(role_id: int, db: AsyncSession = Depends(get_db)):
    """Delete a role (only if no active users)"""
    await role_service.delete_role(db, role_id)
    return None
