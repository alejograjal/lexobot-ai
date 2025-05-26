from sqlalchemy import select
from .base import BaseRepository
from app.core import SecurityConfig
from app.db.models import LoginAttempt
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime, timezone, timedelta

class LoginAttemptRepository(BaseRepository[LoginAttempt]):
    def __init__(self):
        super().__init__(LoginAttempt)

    async def get_current_attempts(self, db: AsyncSession, user_id: int, ip_address: str) -> LoginAttempt:
        stmt = select(LoginAttempt).where(
            LoginAttempt.user_id == user_id,
            LoginAttempt.ip_address == ip_address,
            LoginAttempt.last_attempt >= datetime.now(timezone.utc) - timedelta(minutes=SecurityConfig.LOCKOUT_MINUTES)
        )
        result = await db.execute(stmt)
        return result.scalar_one_or_none()

    async def increment_attempts(self, db: AsyncSession, user_id: int, ip_address: str) -> LoginAttempt:
        attempt = await self.get_current_attempts(db, user_id, ip_address)
        now = datetime.now(timezone.utc)

        if attempt:
            attempt.attempts_count += 1
            attempt.last_attempt = now
        else:
            attempt = LoginAttempt(
                user_id=user_id,
                ip_address=ip_address,
                created_by="0",
                is_active=True,
                last_attempt=now,
            )
            db.add(attempt)

        await db.commit()
        await db.refresh(attempt)
        return attempt