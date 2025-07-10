import uuid
from typing import Optional
from app.db.models import UserToken
from app.schemas import UserTokenCreate
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories import UserTokenRepository
from datetime import datetime, timezone, timedelta
from app.core import InvalidAccountTokenError, ValidationException, TokenPurpose, purpose_labels

class UserTokenService:
    def __init__(self):
        self.repository = UserTokenRepository()

    async def create(self, db: AsyncSession, user_id: int, purpose: TokenPurpose) -> UserToken:
        existing = await self.repository.get_active_by_user_id_and_purpose(db, user_id, purpose)
        if existing:
            raise ValidationException(f"Ya existe un enlace activo para '{purpose_labels[purpose]}'. Por favor revisa tu correo electrónico o espera a que expire.")
        
        if purpose == TokenPurpose.CONFIRM_ACCOUNT:
            expires_at = datetime.now(timezone.utc) + timedelta(hours=6)
        elif purpose == TokenPurpose.RESET_PASSWORD:
            expires_at = datetime.now(timezone.utc) + timedelta(minutes=15)
        else:
            raise ValidationException("El propósito del token no es válido.")

        token_str = str(uuid.uuid4())

        data = UserTokenCreate(
            user_id=user_id,
            token=token_str,
            purpose=purpose,
            expires_at=expires_at,
        )

        return await self.repository.create(db, data.dict())

    async def get_by_token(self, db: AsyncSession, token: str, expected_purpose: Optional[TokenPurpose] = None) -> UserToken:
        token_obj = await self.repository.get_by_token(db, token)

        if not token_obj or token_obj.used or token_obj.expires_at < datetime.now(timezone.utc):
            raise InvalidAccountTokenError()

        if expected_purpose and token_obj.purpose != expected_purpose:
            raise InvalidAccountTokenError()

        return token_obj
    
    async def has_active_token(self, db: AsyncSession, user_id: int, purpose: TokenPurpose) -> bool:
        token = await self.repository.get_active_by_user_id_and_purpose(db, user_id, purpose)
        return token is not None

    async def confirm_token(self, db: AsyncSession, token: str, expected_purpose: Optional[TokenPurpose] = None) -> int:
        token_obj = await self.get_by_token(db, token, expected_purpose)

        token_obj.used = True
        await db.flush()
        return token_obj.user_id

