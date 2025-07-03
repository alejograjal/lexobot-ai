from typing import List
from app.db import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import APIRouter, Depends, status, Query
from app.services import TenantService, TenantUserService, UserService, CompanyUserService
from app.core import require_administrator, require_company_or_admin, require_any_role, UserRole
from app.schemas import TenantCreate, TenantUpdate, TenantResponse, TenantUserCreate, TenantUserUpdate, TenantUserResponse, TenantUserBulkSync, common_errors, not_found_error, validation_error, duplicate_entry_error

router = APIRouter(
    prefix="/tenants",
    tags=["Tenants"]
)
service = TenantService()
tenant_user_service = TenantUserService()
user_service = UserService()
company_user_service = CompanyUserService()

@router.post("", response_model=TenantResponse, status_code=status.HTTP_201_CREATED, dependencies=[Depends(require_administrator)], responses={
    **common_errors,
    **validation_error,
    **duplicate_entry_error
})
async def create_tenant(data: TenantCreate, db: AsyncSession = Depends(get_db)):
    return await service.create(db, data)

@router.post("/{tenant_id}/users/bulk", response_model=List[TenantUserResponse], status_code=status.HTTP_201_CREATED, dependencies=[Depends(require_company_or_admin)], responses={
    **common_errors,
    **validation_error,
    **duplicate_entry_error
})
async def bulk_create_tenants(tenant_id: int, bulk_data: TenantUserBulkSync, db: AsyncSession = Depends(get_db)):
    return await tenant_user_service.create_bulk(db, tenant_id, bulk_data)

@router.get("", response_model=List[TenantResponse], dependencies=[Depends(require_any_role)], responses={**common_errors})
async def list_tenants(include_inactive: bool = False, db: AsyncSession = Depends(get_db)):
    if user_service.is_current_role(UserRole.ADMINISTRATOR.value):
        return await service.get_all(db, include_inactive)
    
    if user_service.is_current_role(UserRole.COMPANY.value):
        return await company_user_service.get_tenants_assigned_to_company_by_current_user(db)
    
    if user_service.is_current_role(UserRole.TENANT.value):
        return await tenant_user_service.get_all_tenants_by_user_per_company(db)
    
    return []

@router.get("/available", response_model=List[TenantResponse], dependencies=[Depends(require_administrator)], responses={**common_errors})
async def get_available_tenants(company_id: int = Query(...), db: AsyncSession = Depends(get_db)):
    return await service.get_available_for_company(db, company_id)

@router.get("/{tenant_id}", response_model=TenantResponse,  dependencies=[Depends(require_any_role)], responses={
    **common_errors,
    **not_found_error
})
async def get_tenant(tenant_id: int, include_inactive: bool = False, db: AsyncSession = Depends(get_db)):
    return await service.get(db, tenant_id, include_inactive)

@router.patch("/{tenant_id}", response_model=TenantResponse, dependencies=[Depends(require_administrator)], responses={
    **common_errors,
    **not_found_error,
    **validation_error,
    **duplicate_entry_error
})
async def update_tenant(tenant_id: int, data: TenantUpdate, db: AsyncSession = Depends(get_db)):
    return await service.update(db, tenant_id, data)

@router.delete("/{tenant_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(require_administrator)], responses={
    **common_errors,
    **not_found_error,
    **validation_error
})
async def delete_tenant(tenant_id: int, db: AsyncSession = Depends(get_db)):
    await service.delete(db, tenant_id)

@router.get("/{tenant_id}/users", response_model=List[TenantUserResponse],dependencies=[Depends(require_company_or_admin)], responses={**common_errors})
async def get_all_users_by_tenant(tenant_id: int, db: AsyncSession = Depends(get_db)):
    return await tenant_user_service.get_all_by_tenant(db, tenant_id)

@router.get("/{tenant_id}/users/{tenant_user_id}", response_model=TenantUserResponse, dependencies=[Depends(require_company_or_admin)], responses={
    **common_errors,
    **not_found_error
})
async def get_tenant_user(tenant_id: int, tenant_user_id: int, db: AsyncSession = Depends(get_db)):
    return await tenant_user_service.get_tenant_user(db, tenant_id, tenant_user_id)

@router.get("/{tenant_id}/tenant-users", response_model=List[TenantUserResponse], dependencies=[Depends(require_company_or_admin)],  responses={**common_errors})
async def get_tenant_users_available_to_assign(tenant_id: int , db: AsyncSession = Depends(get_db)):
    return await tenant_user_service.get_tenant_users_available_to_assign(db, tenant_id)

@router.post("/{tenant_id}/users", response_model=TenantUserResponse, responses={
    **common_errors,
    **validation_error,
    **duplicate_entry_error
})
async def create_tenant_user(tenant_id: int, user_data: TenantUserCreate, db: AsyncSession = Depends(get_db)):
    return await tenant_user_service.create(db, tenant_id, user_data)

@router.patch("/{tenant_id}/users/{tenant_user_id}", response_model=TenantUserResponse, dependencies=[Depends(require_company_or_admin)], responses={
    **common_errors,
    **not_found_error,
    **validation_error,
    **duplicate_entry_error
})
async def update_tenant_user(tenant_id: int, tenant_user_id: int ,user_data: TenantUserUpdate, db: AsyncSession = Depends(get_db)):
    return await tenant_user_service.update(db, tenant_id, tenant_user_id, user_data)

@router.delete("/{tenant_id}/users/{tenant_user_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(require_company_or_admin)], responses={
    **common_errors,
    **not_found_error,
    **validation_error
})
async def delete_tenant_user(tenant_id: int ,tenant_user_id: int, db: AsyncSession = Depends(get_db)):
    await tenant_user_service.delete(db, tenant_id, tenant_user_id)
    return None

@router.put("/{tenant_id}/users/bulk-sync", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(require_company_or_admin)], responses={
    **common_errors,
    **validation_error
})
async def bulk_sync_assignments(
    tenant_id: int,
    bulk_data: TenantUserBulkSync,
    db: AsyncSession = Depends(get_db)
):
    """Synchronize all assignments for a tenant"""
    await tenant_user_service.bulk_sync(db, tenant_id, bulk_data)
    return None