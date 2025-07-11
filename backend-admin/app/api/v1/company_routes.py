from typing import List
from app.db import get_db
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core import require_administrator, require_any_role, UserRole
from app.services import CompanyService, CompanyUserService, UserService, TenantUserService
from app.schemas import CompanyCreate, CompanyUpdate, CompanyResponse, CompanyUserCreate, CompanyUserUpdate, CompanyUserResponse, CompanyUserBulkSync, TenantUserResponse, common_errors, not_found_error, validation_error, duplicate_entry_error

router = APIRouter(
    prefix="/companies",
    tags=["Companies"],
)

company_service = CompanyService()
company_user_service = CompanyUserService()
user_service = UserService()
tenant_user_service = TenantUserService()

@router.post("", response_model=CompanyResponse, status_code=status.HTTP_201_CREATED, dependencies=[Depends(require_administrator)], responses={
    **common_errors,
    **validation_error,
    **duplicate_entry_error
})
async def create_company(
    company_data: CompanyCreate,
    db: AsyncSession = Depends(get_db)
) -> CompanyResponse:
    """Create a new company"""
    return await company_service.create_company(db, company_data)

@router.get("/{company_id}", response_model=CompanyResponse, dependencies=[Depends(require_any_role)], responses={
    **common_errors,
    **not_found_error
})
async def get_company(
    company_id: int,
    include_inactive: bool = False,
    db: AsyncSession = Depends(get_db)
) -> CompanyResponse:
    """Get a company by ID"""
    return await company_service.get_company(db, company_id, include_inactive)

@router.get("", response_model=List[CompanyResponse], dependencies=[Depends(require_any_role)],  responses={**common_errors})
async def get_companies(
    include_inactive: bool = False,
    db: AsyncSession = Depends(get_db)
) -> List[CompanyResponse]:
    if user_service.is_current_role(UserRole.ADMINISTRATOR.value):
        return await company_service.get_companies(db, include_inactive)
    
    if user_service.is_current_role(UserRole.COMPANY.value):
        return await company_user_service.get_all_company_by_current_user(db)
    
    if user_service.is_current_role(UserRole.TENANT.value):
        return await tenant_user_service.get_all_companies_by_user_per_tenant(db)
    
    return []
    

@router.patch("/{company_id}", response_model=CompanyResponse, dependencies=[Depends(require_administrator)],  responses={
    **common_errors,
    **not_found_error,
    **validation_error,
    **duplicate_entry_error
})
async def update_company(
    company_id: int,
    company_data: CompanyUpdate,
    db: AsyncSession = Depends(get_db)
) -> CompanyResponse:
    """Update a company"""
    return await company_service.update_company(db, company_id, company_data)

@router.delete("/{company_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(require_administrator)],  responses={
    **common_errors,
    **not_found_error,
    **validation_error
})
async def delete_company(
    company_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Soft delete a company"""
    await company_service.delete_company(db, company_id)
    return None

@router.get("/{company_id}/users", response_model=List[CompanyUserResponse], dependencies=[Depends(require_administrator)],  responses={**common_errors})
async def get_all_users_by_company(company_id: int, db: AsyncSession = Depends(get_db)):
    return await company_user_service.get_all_by_company(db, company_id)

@router.get("/{company_id}/users/{company_user_id}", response_model=CompanyUserResponse, dependencies=[Depends(require_administrator)],  responses={
    **common_errors,
    **not_found_error
})
async def get_company_user(company_id: int, company_user_id: int, db: AsyncSession = Depends(get_db)):
    return await company_user_service.get_company_user(db, company_user_id)

@router.post("/{company_id}/users", response_model=CompanyUserResponse, dependencies=[Depends(require_administrator)], responses={
    **common_errors,
    **validation_error,
    **duplicate_entry_error
})
async def create_company_user(company_id: int, user_data: CompanyUserCreate, db: AsyncSession = Depends(get_db)):
    return await company_user_service.create(db, company_id, user_data)

@router.patch("/{company_id}/users/{company_user_id}", response_model=CompanyUserResponse, dependencies=[Depends(require_administrator)], responses={
    **common_errors,
    **not_found_error,
    **validation_error,
    **duplicate_entry_error
})
async def update_company_user(company_id: int, company_user_id: int ,user_data: CompanyUserUpdate, db: AsyncSession = Depends(get_db)):
    return await company_user_service.update(db, company_id, company_user_id, user_data)

@router.delete("/{company_id}/users/{company_user_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(require_administrator)], responses={
    **common_errors,
    **not_found_error,
    **validation_error
})
async def delete_company_user(company_id: int, company_user_id: int, db: AsyncSession = Depends(get_db)):
    await company_user_service.delete(db, company_id, company_user_id)
    return None

@router.post("/{company_id}/users/{company_user_id}/resend-invite", response_model=bool, dependencies=[Depends(require_administrator)], responses={
    **common_errors,
    **not_found_error,
    **validation_error
})
async def resend_invite(company_id: int, company_user_id: int, db: AsyncSession = Depends(get_db)):
    await company_user_service.resend_invite(db, company_id, company_user_id)
    return True

@router.put("/{company_id}/users/bulk-sync", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(require_administrator)], responses={
    **common_errors,
    **validation_error
})
async def bulk_sync_assignments(
    company_id: int,
    bulk_data: CompanyUserBulkSync,
    db: AsyncSession = Depends(get_db)
):
    """Synchronize all assignments for a company"""
    await company_user_service.bulk_sync(db, company_id, bulk_data)
    return None