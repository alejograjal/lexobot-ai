from typing import List
from app.db import get_db
from app.core import require_any_role
from app.services import TenantDocumentService
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import APIRouter, Depends, status, UploadFile, File, Form
from app.schemas import TenantDocumentCreate, TenantDocumentResponse, common_errors, not_found_error, validation_error, duplicate_entry_error

router = APIRouter(
    prefix="/tenants/{tenant_id}/documents",
    tags=["Tenant Documents"]
)

document_service = TenantDocumentService()

@router.get("", response_model=List[TenantDocumentResponse], status_code=status.HTTP_200_OK, summary="List tenant documents", dependencies=[Depends(require_any_role)], responses={
    **common_errors,
    **not_found_error,
})
async def list_documents(
    tenant_id: int,
    db: AsyncSession = Depends(get_db)
) -> List[TenantDocumentResponse]:
    """List all documents for a tenant"""
    return await document_service.get_tenant_documents(db, tenant_id)

@router.post("", response_model=TenantDocumentResponse, status_code=status.HTTP_201_CREATED, dependencies=[Depends(require_any_role)], responses={
    **common_errors,
    **not_found_error,
    **validation_error,
    **duplicate_entry_error,
})
async def create_document(
    tenant_id: int,
    document_name: str = Form(...),
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db)
) -> TenantDocumentResponse:
    """Create a new document for a tenant"""
    document_data = TenantDocumentCreate(document_name=document_name)
    return await document_service.create_document(db, tenant_id, document_data, file)

@router.put(
    "/bulk",
    response_model=List[TenantDocumentResponse],
    status_code=status.HTTP_200_OK,
    summary="Bulk update tenant documents",
    description="Replace all documents for a tenant with a new list",
    dependencies=[Depends(require_any_role)],
    responses={
        **common_errors,
        **validation_error
    }
)
async def bulk_update_tenant_documents(
    tenant_id: int,
    document_data: List[TenantDocumentCreate],
    db: AsyncSession = Depends(get_db)
) -> List[TenantDocumentResponse]:
    """
    Replace all documents for a tenant with a new list.
    All existing documents will be removed and replaced with the new ones.
    """
    return await document_service.bulk_update_tenant_documents(db, tenant_id, document_data)

@router.get("/{document_id}", response_model=TenantDocumentResponse, dependencies=[Depends(require_any_role)], responses={
    **common_errors,
    **not_found_error,
    **validation_error
})
async def get_document(
    tenant_id: int,
    document_id: int,
    db: AsyncSession = Depends(get_db)
) -> TenantDocumentResponse:
    """Get a specific document"""
    return await document_service.get_document(db, tenant_id, document_id)

@router.delete("/{document_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(require_any_role)], responses={
    **common_errors,
    **not_found_error,
    **validation_error
})
async def delete_document(
    tenant_id: int,
    document_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Delete a document"""
    await document_service.delete_document(db, tenant_id, document_id)
    return None