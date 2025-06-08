from typing import List
from app.db.models import TenantDocument
from .tenant_service import TenantService
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories import TenantDocumentRepository
from app.schemas import TenantDocumentCreate, TenantDocumentUpdate
from app.core import NotFoundException, DuplicateEntryError, ValidationException

class TenantDocumentService:
    def __init__(self):
        self.repository = TenantDocumentRepository()
        self.tenant_service = TenantService()

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

    async def create_document(self, db: AsyncSession, tenant_id: int, document_data: TenantDocumentCreate) -> TenantDocument:
        await self._validate_tenant_exists(db, tenant_id)

        existing = await self.repository.get_by_name(db, tenant_id, document_data.document_name)
        if existing:
            raise DuplicateEntryError("TenantDocument", "document_name")
        
        document_data.tenant_id = tenant_id

        return await self.repository.create(db, document_data.dict())
    
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

    async def get_document(self, db: AsyncSession, tenant_id: int, document_id: int) -> TenantDocument:
        await self._validate_tenant_exists(db, tenant_id)
        return await self._validate_document_belongs_to_tenant(db, tenant_id, document_id)

    async def update_document(
        self, 
        db: AsyncSession, 
        tenant_id: int,
        document_id: int, 
        document_data: TenantDocumentUpdate
    ) -> TenantDocument:
        await self._validate_tenant_exists(db, tenant_id)
        await self._validate_document_belongs_to_tenant(db, tenant_id, document_id)
        
        return await self.repository.update(db, document_id, document_data.dict(exclude_unset=True))

    async def delete_document(self, db: AsyncSession, tenant_id: int, document_id: int) -> bool:
        await self._validate_tenant_exists(db, tenant_id)
        await self._validate_document_belongs_to_tenant(db, tenant_id, document_id)
        
        return await self.repository.delete(db, document_id)