from typing import List
from app.db import get_db
from app.services import TenantService
from app.core import require_administrator
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas import TenantCreate, TenantUpdate, TenantResponse, common_errors, not_found_error, validation_error, duplicate_entry_error

router = APIRouter(
    prefix="/tenants",
    tags=["Tenants"],
    dependencies=[Depends(require_administrator)]
)
service = TenantService()

@router.post("", response_model=TenantResponse, status_code=status.HTTP_201_CREATED, responses={
    **common_errors,
    **validation_error,
    **duplicate_entry_error
})
async def create_tenant(data: TenantCreate, db: AsyncSession = Depends(get_db)):
    return await service.create(db, data)

@router.get("", response_model=List[TenantResponse], responses={**common_errors})
async def list_tenants(include_inactive: bool = False, db: AsyncSession = Depends(get_db)):
    return await service.get_all(db, include_inactive)

@router.get("/{tenant_id}", response_model=TenantResponse, responses={
    **common_errors,
    **not_found_error
})
async def get_tenant(tenant_id: int, include_inactive: bool = False, db: AsyncSession = Depends(get_db)):
    return await service.get(db, tenant_id, include_inactive)

@router.put("/{tenant_id}", response_model=TenantResponse, responses={
    **common_errors,
    **not_found_error,
    **validation_error,
    **duplicate_entry_error
})
async def update_tenant(tenant_id: int, data: TenantUpdate, db: AsyncSession = Depends(get_db)):
    return await service.update(db, tenant_id, data)

@router.delete("/{tenant_id}", status_code=status.HTTP_204_NO_CONTENT, responses={
    **common_errors,
    **not_found_error,
    **validation_error
})
async def delete_tenant(tenant_id: int, db: AsyncSession = Depends(get_db)):
    await service.delete(db, tenant_id)
