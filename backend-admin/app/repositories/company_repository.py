from typing import Optional
from .base import BaseRepository
from app.db.models import Company
from sqlalchemy import and_, select
from sqlalchemy.ext.asyncio import AsyncSession

class CompanyRepository(BaseRepository[Company]):
    def __init__(self):
        super().__init__(Company)

    async def get_by_legal_id(self, db: AsyncSession, legal_id: str) -> Optional[Company]:
        stmt = select(Company).where(
            and_(
                Company.legal_id == legal_id,
                Company.is_active == True
            )
        )
        result = await db.execute(stmt)
        return result.scalar_one_or_none()
    
    async def get_by_email(self, db: AsyncSession, email: str) -> Optional[Company]:
        stmt = select(Company).where(
            and_(
                Company.email == email,
                Company.is_active == True
            )
        )
        result = await db.execute(stmt)
        return result.scalar_one_or_none()

    async def get_by_billing_email(self, db: AsyncSession, billing_email: str) -> Optional[Company]:
        stmt = select(Company).where(
            and_(
                Company.billing_email == billing_email,
                Company.is_active == True
            )
        )
        result = await db.execute(stmt)
        return result.scalar_one_or_none()