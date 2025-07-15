from typing import List
from fastapi import UploadFile
from app.clients import TenantApiClient
from app.db.models import TenantDocument
from .tenant_service import TenantService
from app.schemas import TenantDocumentCreate
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories import TenantDocumentRepository
from .company_access_service import CompanyAccessService
from .company_tenant_assignment_service import CompanyTenantAssignmentService
from app.core import NotFoundException, DuplicateEntryError, ValidationException, UploadToTenantWorkerError, TenantUploadError

class TenantDocumentService:
    def __init__(self):
        self.repository = TenantDocumentRepository()
        self.tenant_service = TenantService()
        self.company_access_service = CompanyAccessService()
        self.company_tenant_assignment_service = CompanyTenantAssignmentService()

    async def _validate_tenant_exists(self, db: AsyncSession, tenant_id: int):
        await self.tenant_service.get(db, tenant_id)
    
    async def _validate_document_belongs_to_tenant(
        self, db: AsyncSession, tenant_id: int, document_id: int
    ) -> TenantDocument:
        document = await self.repository.get_by_id(db, document_id)
        if not document:
            raise NotFoundException("Document", document_id)
        
        if document.tenant_id != tenant_id:
            raise ValidationException("Document does not belong to tenant")
        
        return document

    async def create_document(self, db: AsyncSession, tenant_id: int, document_data: TenantDocumentCreate, file: UploadFile) -> TenantDocument:
        async with db.begin():
            tenant = await self.tenant_service.get(db, tenant_id)

            formatted_date = document_data.effective_date.strftime("%Y-%m-%d")
            document_name = f"{document_data.document_name}_{formatted_date}.pdf";

            existing = await self.repository.get_by_name(db, tenant_id, document_name)
            if existing:
                raise DuplicateEntryError("TenantDocument", "document_name")
            
            company_access_id = await self.company_tenant_assignment_service.get_company_id_by_tenant_id(db, tenant_id)
            company_worker_id = await self.company_access_service.get_company_worker_id(db, company_access_id)

            file_bytes = await file.read()
            file_path = f"/tenants/{tenant.external_id}/docs/{document_name}"

            create_data = document_data.dict()
            create_data.update({
                "tenant_id": tenant_id,
                "file_path": file_path,
                "document_name": f"{document_name}"
            })
            
            created = await self.repository.create(db, create_data)

            try:
                async with TenantApiClient() as client:
                    await client.upload_document(
                        company_access_id=company_worker_id,
                        file_bytes=file_bytes,
                        document_name=create_data["document_name"],
                        external_id=str(tenant.external_id)
                    )

            except Exception as e:
                await db.rollback()
                raise TenantUploadError(tenant_id) from e

        return created
    
    async def bulk_update_tenant_documents(
        self, db: AsyncSession, tenant_id: int, document_data: List[TenantDocumentCreate]
    ) -> List[TenantDocument]:
        """
        Replace all documents for a tenant in a single transaction.
        Physically removes existing documents and creates new ones atomically.
        """
        await self._validate_tenant_exists(db, tenant_id)

        if not document_data:
            raise ValidationException("Document list cannot be empty")

        async with db.begin():
            existing_docs = await self.repository.get_by_tenant(db, tenant_id)
            for doc in existing_docs:
                await self.repository.remove(db, doc.id)

            doc_dicts = [d.dict() for d in document_data]
            return await self.repository.bulk_create(db, doc_dicts)

    async def get_tenant_documents(self, db: AsyncSession, tenant_id: int) -> List[TenantDocument]:
        await self._validate_tenant_exists(db, tenant_id)

        return await self.repository.get_by_tenant(db, tenant_id)
    
    async def get_tenant_documents_count(self, db: AsyncSession, tenant_id: int) -> int:
        await self._validate_tenant_exists(db, tenant_id)

        return await self.repository.count_by_tenant(db, tenant_id)

    async def get_document(self, db: AsyncSession, tenant_id: int, document_id: int) -> TenantDocument:
        await self._validate_tenant_exists(db, tenant_id)
        return await self._validate_document_belongs_to_tenant(db, tenant_id, document_id)

    async def delete_document(self, db: AsyncSession, tenant_id: int, document_id: int) -> bool:
        async with db.begin():
            tenant = await self.tenant_service.get(db, tenant_id)
            await self._validate_document_belongs_to_tenant(db, tenant_id, document_id)

            document = await self.repository.get_by_id(db, document_id)
            if not document:
                raise NotFoundException("Document", document_id)

            company_access_id = await self.company_tenant_assignment_service.get_company_id_by_tenant_id(db, tenant_id)
            company_worker_id = await self.company_access_service.get_company_worker_id(db, company_access_id)
            
            deleted = await self.repository.delete(db, document_id)

            try:
                async with TenantApiClient() as client:
                    await client.remove_document(
                        company_access_id=company_worker_id,
                        document_name=document.document_name,
                        external_id=str(tenant.external_id)
                    )

            except Exception as e:
                await db.rollback()
                raise UploadToTenantWorkerError("remove document", tenant_id, str(e)) from e

        return deleted