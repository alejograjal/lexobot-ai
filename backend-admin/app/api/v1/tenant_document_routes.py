from typing import List
from app.db import get_db
from app.core import require_administrator
from fastapi import APIRouter, Depends, status
from app.services import TenantDocumentService
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas import TenantDocumentCreate, TenantDocumentUpdate, TenantDocumentResponse, common_errors, not_found_error, validation_error, duplicate_entry_error

router = APIRouter(
    prefix="/tenants/{tenant_id}/documents",
    tags=["Tenant Documents"],
    dependencies=[Depends(require_administrator)]
)

document_service = TenantDocumentService()

@router.get("", response_model=List[TenantDocumentResponse], status_code=status.HTTP_200_OK, summary="List tenant documents", responses={
    **common_errors,
    **not_found_error,
})
async def list_documents(
    tenant_id: int,
    db: AsyncSession = Depends(get_db)
) -> List[TenantDocumentResponse]:
    """List all documents for a tenant"""
    return await document_service.get_tenant_documents(db, tenant_id)

@router.post("/", response_model=TenantDocumentResponse, status_code=status.HTTP_201_CREATED, responses={
    **common_errors,
    **not_found_error,
    **validation_error,
    **duplicate_entry_error,
})
async def create_document(
    tenant_id: int,
    document_data: TenantDocumentCreate,
    db: AsyncSession = Depends(get_db)
) -> TenantDocumentResponse:
    """Create a new document for a tenant"""
    return await document_service.create_document(db, tenant_id, document_data)

@router.put(
    "/bulk",
    response_model=List[TenantDocumentResponse],
    status_code=status.HTTP_200_OK,
    summary="Bulk update tenant documents",
    description="Replace all documents for a tenant with a new list",
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

@router.get("/{document_id}", response_model=TenantDocumentResponse, responses={
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

@router.patch("/{document_id}", response_model=TenantDocumentResponse, responses={
    **common_errors,
    **not_found_error,
    **validation_error
})
async def update_document(
    tenant_id: int,
    document_id: int,
    document_data: TenantDocumentUpdate,
    db: AsyncSession = Depends(get_db)
) -> TenantDocumentResponse:
    """Update a document's information"""
    return await document_service.update_document(db, tenant_id, document_id, document_data)

@router.delete("/{document_id}", status_code=status.HTTP_204_NO_CONTENT, responses={
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