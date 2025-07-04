from typing import List
from .base import BaseRepository
from sqlalchemy.orm import selectinload
from app.db.models import TenantDocument
from sqlalchemy import and_, select, func
from sqlalchemy.ext.asyncio import AsyncSession

class TenantDocumentRepository(BaseRepository[TenantDocument]):
    def __init__(self):
        super().__init__(TenantDocument, relationships=['tenant'])
    
    async def get_by_tenant(self, db: AsyncSession, tenant_id: int) -> List[TenantDocument]:
        options = [selectinload(getattr(self.model, rel)) for rel in self.relationships]
        
        stmt = select(self.model).where(
            self.model.tenant_id == tenant_id,
            self.model.is_active == True
        ).options(*options)
        
        result = await db.execute(stmt)
        return result.scalars().all()
    
    async def count_by_tenant(self, db: AsyncSession, tenant_id: int) -> int:
        stmt = select(func.count()).where(
            self.model.tenant_id == tenant_id,
            self.model.is_active == True
        )
        result = await db.execute(stmt)
        return result.scalar_one()

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