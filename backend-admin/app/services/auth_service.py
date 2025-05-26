from fastapi import Request
from .user_service import UserService
from sqlalchemy.ext.asyncio import AsyncSession
from .login_attempt_service import LoginAttemptService
from app.core import InvalidCredentialsError, AccountLockedError, SecurityHandler, InvalidTokenError

class AuthService:
    def __init__(self):
        self.user_service = UserService()
        self.login_attempt_service = LoginAttemptService()

    async def attempt_login(
        self, 
        db: AsyncSession, 
        username: str, 
        password: str, 
        request: Request
    ) -> dict:
        user = await self.user_service.get_by_username(db, username)
        if not user:
            raise InvalidCredentialsError()

        ip_address = request.client.host
        attempts = await self.login_attempt_service.get_current_attempts(
            db, user.id, ip_address
        )

        is_locked, remaining_time = self.login_attempt_service.is_user_locked(attempts)
        if is_locked:
            raise AccountLockedError(remaining_time)

        if not SecurityHandler.verify_password(password, user.password_hash):
            await self.login_attempt_service.increment_attempts(db, user.id, ip_address)
            raise InvalidCredentialsError()

        access_token = SecurityHandler.create_access_token(
            subject=str(user.id),
            additional_data={
                "role": {
                    "id": user.role.id,
                    "name": user.role.name
                },
                "username": user.username
            }
        )
        refresh_token = SecurityHandler.create_refresh_token(
            subject=str(user.id)
        )

        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer"
        }
    
    async def refresh_access_token(self, db: AsyncSession, refresh_token: str) -> dict:
        """
        Create a new access token using a valid refresh token
        """
        payload = SecurityHandler.verify_token(refresh_token, token_type="refresh")
        if not payload:
            raise InvalidTokenError()
        
        user = await self.user_service.get_by_id(db, int(payload["sub"]))
        if not user:
            raise InvalidTokenError()
        
        print(f"User: {user.role.name}")

        access_token = SecurityHandler.create_access_token(
            subject=str(user.id),
            additional_data={
                "role": {
                    "id": user.role.id,
                    "name": user.role.name
                },
                "username": user.username
            }
        )

        print(f"Creating new refresh token for user {access_token}")

        new_refresh_token = SecurityHandler.create_refresh_token(
            subject=str(user.id)
        )

        return {
            "access_token": access_token,
            "refresh_token": new_refresh_token,
            "token_type": "bearer"
        }