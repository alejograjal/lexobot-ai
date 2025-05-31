from app.db import get_db
from app.core import require_administrator
from app.services import CompanyAccessService
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas import CompanyAccessCreate, CompanyAccessUpdate, CompanyAccessResponse

router = APIRouter(
    prefix="/company_access",
    tags=["company_access"],
    dependencies=[Depends(require_administrator)]
)

service = CompanyAccessService()

@router.post("/", response_model=CompanyAccessResponse, status_code=status.HTTP_201_CREATED)
async def create_company_access(
    payload: CompanyAccessCreate,
    db: AsyncSession = Depends(get_db),
) -> CompanyAccessResponse:
    return await service.create_access(db, payload)

@router.patch("/{access_id}", response_model=CompanyAccessResponse, status_code=status.HTTP_200_OK)
async def update_company_access(
    access_id: int,
    payload: CompanyAccessUpdate,
    db: AsyncSession = Depends(get_db),
):
    return await service.update_access(db, access_id, payload)


@router.delete("/{access_id}", response_model=bool, status_code=status.HTTP_204_NO_CONTENT)
async def delete_company_access(
    access_id: int,
    db: AsyncSession = Depends(get_db),
):
    return await service.delete_access(db, access_id)
