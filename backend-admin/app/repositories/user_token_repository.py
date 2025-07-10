from typing import Optional
from .base import BaseRepository
from app.core import TokenPurpose
from sqlalchemy import select, and_
from app.db.models import UserToken
from datetime import datetime, timezone
from sqlalchemy.ext.asyncio import AsyncSession

class UserTokenRepository(BaseRepository[UserToken]):
    def __init__(self):
        super().__init__(UserToken)

    async def get_by_token(self, db: AsyncSession, token: str) -> Optional[UserToken]:
        stmt = select(self.model).where(
            and_(
                self.model.token == token,
                self.model.is_active == True
            )
        )
        result = await db.execute(stmt)
        return result.scalar_one_or_none()
    
    async def get_by_user_id(self, db: AsyncSession, user_id: int) -> Optional[UserToken]:
        stmt = select(self.model).where(
            and_(
                self.self.model.user_id == user_id,
                self.model.is_active == True
            )
        )
        result = await db.execute(stmt)
        return result.scalar_one_or_none()
    
    async def get_active_by_user_id_and_purpose(self, db: AsyncSession, user_id: int, purpose: TokenPurpose) -> Optional[UserToken]:
        stmt = select(self.model).where(
            self.model.user_id == user_id,
            self.model.purpose == purpose,
            self.model.used == False,
            self.model.expires_at > datetime.now(timezone.utc)
        ).order_by(self.model.expires_at.desc()).limit(1)

        result = await db.execute(stmt)
        return result.scalar_one_or_none()
    