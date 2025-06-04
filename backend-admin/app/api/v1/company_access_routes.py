from typing import List
from app.db import get_db
from app.core import require_administrator
from app.services import CompanyAccessService
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas import CompanyAccessCreate, CompanyAccessUpdate, CompanyAccessResponse

router = APIRouter(
    prefix="/companies/{company_id}/accesses",
    tags=["Company Accesses"],
    dependencies=[Depends(require_administrator)]
)

service = CompanyAccessService()

@router.get("/", response_model=List[CompanyAccessResponse])
async def list_accesses(company_id: int, db: AsyncSession = Depends(get_db)):
    return await service.list_accesses_by_company(db, company_id)

@router.get("/{access_id}", response_model=CompanyAccessResponse, status_code=status.HTTP_200_OK)
async def get_access(
    company_id: int,
    access_id: int,
    db: AsyncSession = Depends(get_db),
) -> CompanyAccessResponse:
    return await service.get_access(db, company_id, access_id)

@router.post("/", response_model=CompanyAccessResponse, status_code=status.HTTP_201_CREATED)
async def create_access(company_id: int, payload: CompanyAccessCreate, db: AsyncSession = Depends(get_db)):
    return await service.create_access(db, company_id, payload)

@router.patch("/{access_id}", response_model=CompanyAccessResponse)
async def update_access(company_id: int, access_id: int, payload: CompanyAccessUpdate, db: AsyncSession = Depends(get_db)):
    return await service.update_access(db, company_id, access_id, payload)

@router.delete("/{access_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_access(company_id: int, access_id: int, db: AsyncSession = Depends(get_db)):
    await service.delete_access(db, company_id, access_id)
    return None
