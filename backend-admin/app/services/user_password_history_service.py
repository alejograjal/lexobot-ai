from app.db.models import UserPasswordHistory
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas import UserPasswordHistoryCreate
from app.repositories import UserPasswordHistoryRepository
from app.core import DuplicatePasswordError, SecurityHandler

class UserPasswordHistoryService:
    def __init__(self):
        self.repository = UserPasswordHistoryRepository()

    async def create(self, db: AsyncSession, data: UserPasswordHistoryCreate) -> UserPasswordHistory:
        recent = await self.repository.get_by_user_id(db, data.user_id)

        if any(SecurityHandler.verify_password(data.plain_password, item.password_hash) for item in recent):
            raise DuplicatePasswordError()
        if len(recent) >= 5:
            oldest = min(recent, key=lambda p: p.created_at)
            await self.repository.delete(db, oldest.id)

        user_password_history = {
            "user_id": data.user_id,
            "password_hash": data.password_hash
        }

        return await self.repository.create(db, user_password_history)
