from typing import List
from app.db import get_db
from app.services import CompanyService
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core import require_administrator, require_any_role
from app.schemas import CompanyCreate, CompanyUpdate, CompanyResponse, common_errors, not_found_error, validation_error, duplicate_entry_error

router = APIRouter(
    prefix="/companies",
    tags=["Companies"],
    dependencies=[Depends(require_administrator)]
)

company_service = CompanyService()

@router.post("/", response_model=CompanyResponse, status_code=status.HTTP_201_CREATED, responses={
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

@router.get("/", response_model=List[CompanyResponse], responses={**common_errors})
async def get_companies(
    include_inactive: bool = False,
    db: AsyncSession = Depends(get_db)
) -> List[CompanyResponse]:
    """Get all companies"""
    return await company_service.get_companies(db, include_inactive)

@router.patch("/{company_id}", response_model=CompanyResponse, responses={
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

@router.delete("/{company_id}", status_code=status.HTTP_204_NO_CONTENT, responses={
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