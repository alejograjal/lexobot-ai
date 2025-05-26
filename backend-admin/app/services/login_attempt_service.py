from app.core import SecurityConfig
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime, timezone, timedelta
from app.repositories import LoginAttemptRepository

class LoginAttemptService:
    def __init__(self):
        self.repository = LoginAttemptRepository()

    async def get_current_attempts(self, db: AsyncSession, user_id: int, ip_address: str):
        return await self.repository.get_current_attempts(db, user_id, ip_address)

    async def increment_attempts(self, db: AsyncSession, user_id: int, ip_address: str):
        return await self.repository.increment_attempts(db, user_id, ip_address)

    def is_user_locked(self, attempts) -> tuple[bool, timedelta]:
        if not attempts or attempts.attempts_count < SecurityConfig.MAX_LOGIN_ATTEMPTS:
            return False, 0

        current_time = datetime.now(timezone.utc)
        lockout_time = attempts.last_attempt.replace(tzinfo=timezone.utc) + timedelta(
            minutes=SecurityConfig.LOCKOUT_MINUTES
        )
        
        is_locked = current_time < lockout_time
        remaining_time = int((lockout_time - current_time).total_seconds() / 60) if is_locked else 0

        return is_locked, remaining_time