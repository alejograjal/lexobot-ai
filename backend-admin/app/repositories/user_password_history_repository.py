from typing import List
from .base import BaseRepository
from sqlalchemy import select, and_
from app.db.models import UserPasswordHistory
from sqlalchemy.ext.asyncio import AsyncSession

class UserPasswordHistoryRepository(BaseRepository[UserPasswordHistory]):
    def __init__(self):
        super().__init__(UserPasswordHistory)

    async def get_by_user_id(self, db: AsyncSession, user_id: int) -> List[UserPasswordHistory]:
        stmt = select(self.model).where(
            and_(   
                self.model.user_id == user_id,
                self.model.is_active == True
            )
        )
        result = await db.execute(stmt)
        return result.scalars().all()