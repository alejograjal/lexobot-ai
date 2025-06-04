from typing import List
from .base import BaseRepository
from sqlalchemy import and_, select
from app.db.models import TenantDocument
from sqlalchemy.ext.asyncio import AsyncSession

class TenantDocumentRepository(BaseRepository[TenantDocument]):
    def __init__(self):
        super().__init__(TenantDocument, relationships=['tenant'])
    
    async def get_by_tenant(self, db: AsyncSession, tenant_id: int) -> List[TenantDocument]:
        stmt = select(self.model).where(
            and_(
                self.model.tenant_id == tenant_id,
                self.model.is_active == True
            )
        ).options(*[getattr(self.model, rel) for rel in self.relationships])
        result = await db.execute(stmt)
        return result.scalars().all()

    async def get_by_name(self, db: AsyncSession, tenant_id: int, document_name: str) -> TenantDocument | None:
        stmt = select(self.model).where(
            and_(
                self.model.tenant_id == tenant_id,
                self.model.document_name == document_name,
                self.model.is_active == True
            )
        )
        result = await db.execute(stmt)
        return result.scalar_one_or_none()