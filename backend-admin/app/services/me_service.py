
from typing import Optional
from app.schemas import UserProfile
from .user_service import UserService
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.user_context_service import get_current_username

class MeService:
    def __init__(self):
        self.user_service = UserService()

    async def get_current_user(self, db: AsyncSession) -> Optional[UserProfile]:
        """
        Get current user profile
        """
        username = get_current_username()
        if not username or username == 'api-lexobot':
            return None
        return await self.user_service.get_by_username(db, username)