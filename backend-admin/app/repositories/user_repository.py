from app.db.models import User
from .base import BaseRepository
from typing import List, Optional
from sqlalchemy import and_, select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession

class UserRepository(BaseRepository[User]):
    def __init__(self):
        super().__init__(User, relationships=['role'])

    async def get_all_by_role(self, db: AsyncSession, role_id: int) -> List[User]:
        stmt = select(User).where(
            and_(
                User.role_id == role_id,
                User.is_active == True
            )
        )

        result = await db.execute(stmt)
        return result.scalars().all()

    async def get_by_username(self, db: AsyncSession, username: str) -> Optional[User]:
        stmt = (
            select(User)
            .options(selectinload(User.role))
            .where(
                and_(
                    User.username == username,
                    User.is_active == True
                )
            )
        )
        result = await db.execute(stmt)
        return result.scalar_one_or_none()

    async def get_by_email(self, db: AsyncSession, email: str) -> Optional[User]:
        stmt = select(User).where(
            and_(
                User.email == email,
                User.is_active == True
            )
        )
        result = await db.execute(stmt)
        return result.scalar_one_or_none()
    
    async def get_by_phoneNumber(self, db: AsyncSession, phoneNumber: str) -> Optional[User]:
        stmt = select(User).where(
            and_(
                User.phone_number == phoneNumber,
                User.is_active == True
            )
        )
        result = await db.execute(stmt)
        return result.scalar_one_or_none()