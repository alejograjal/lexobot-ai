import re
from app.db.models import User
from typing import List, Optional
from app.repositories import UserRepository
from .email.email_service import EmailService
from sqlalchemy.ext.asyncio import AsyncSession
from .user_token_service import UserTokenService
from app.core import UserRole, settings, TokenPurpose
from app.core import get_current_role, SecurityHandler
from .user_password_history_service import UserPasswordHistoryService
from app.core import DuplicateEntryError, NotFoundException, ValidationException, DuplicatePasswordError, AppException
from app.schemas import UserCreate, UserUpdate, UserAccountConfirmation, UserChangePassword, UserPasswordHistoryCreate, ResetPasswordRequest

class UserService:
    ROLE_ID_TO_ENUM = {
        1: UserRole.ADMINISTRATOR.value,
        2: UserRole.COMPANY.value,
        3: UserRole.TENANT.value
    }

    def __init__(self):
        self.repository = UserRepository()
        self.user_token_service = UserTokenService()
        self.user_password_history_service = UserPasswordHistoryService()
        self.email_service = EmailService()

    async def get_all(self, db: AsyncSession, role_id: int = None) -> List[User]:
        if role_id is None:
            return await self.repository.get_all(db)

        return await self.repository.get_all_by_role(db, role_id)

    async def get_by_id(self, db: AsyncSession, user_id: int) -> Optional[User]:
        user = await self.repository.get_by_id(db, user_id)
        if not user:
            raise NotFoundException(f"User", user_id)
        
        return user

    async def get_by_username(self, db: AsyncSession, username: str) -> Optional[User]:
        """
        Get a user by username. Returns None if user doesn't exist or is inactive
        """
        return await self.repository.get_by_username(db, username)
    
    async def create_user(self, db: AsyncSession, user_data: UserCreate) -> User:
        if db.in_transaction():
            return await self._create_user_internal(db, user_data)
        else:
            async with db.begin():
                return await self._create_user_internal(db, user_data)

    async def _create_user_internal(self, db: AsyncSession, user_data: UserCreate) -> User:
        role_value = self.ROLE_ID_TO_ENUM.get(user_data.role_id)
        if self.is_current_role(UserRole.COMPANY.value) and role_value in [ UserRole.COMPANY.value, UserRole.ADMINISTRATOR.value ]:
            raise ValidationException("You are not allowed to assign this role.")

        if await self.repository.get_by_email(db, user_data.email):
            raise DuplicateEntryError("User", "email")

        user = await self.repository.create(db, user_data.dict())

        user_token = await self.user_token_service.create(db, user.id, TokenPurpose.CONFIRM_ACCOUNT)

        confirmation_link = f"{settings.AUTH_USER_LINK}/confirm?token={user_token.token}"

        await self.email_service.send_account_confirmation(user_data.email, f"{user_data.first_name} {user_data.last_name}", confirmation_link)

        return user

    async def update_user(
        self, 
        db: AsyncSession, 
        user_id: int, 
        user_data: UserUpdate
    ) -> Optional[User]:
        current_user = await self.repository.get_by_id(db, user_id)
        if not current_user:
            raise NotFoundException("User", user_id)

        update_data = user_data.dict(exclude_unset=True)

        if "role_id" in update_data and current_user.role_id != update_data["role_id"]:
            role_value = self.ROLE_ID_TO_ENUM.get(update_data["role_id"])
            if self.is_current_role(UserRole.COMPANY.value) and role_value in [UserRole.COMPANY.value, UserRole.ADMINISTRATOR.value]:
                raise ValidationException("You are not allowed to assign this role.")
        
        if "username" in update_data:
            existing = await self.repository.get_by_username(db, update_data["username"])
            if existing and existing.id != user_id:
                raise DuplicateEntryError("User", "username")
        
        if "email" in update_data:
            existing = await self.repository.get_by_email(db, update_data["email"])
            if existing and existing.id != user_id:
                raise DuplicateEntryError("User", "email")
            
        if "phoneNumber" in update_data:
            existing = await self.repository.get_by_phoneNumber(db, update_data["phoneNumber"])
            if existing and existing.id != user_id:
                raise DuplicateEntryError("User", "phone_number")
        
        return await self.repository.update(db, user_id, update_data)
    
    async def delete_user(self, db: AsyncSession, user_id: int) -> None:
        current_user = await self.repository.get_by_id(db, user_id)
        if not current_user:
            raise NotFoundException("User", user_id)
        
        if current_user.role_id == UserRole.ADMINISTRATOR.value:
            raise ValidationException("You cannot delete an administrator user.")
        
        if current_user.role_id == UserRole.COMPANY.value and self.is_current_role(UserRole.COMPANY.value):
            raise ValidationException("You cannot delete a company user.")
        
        await self.repository.delete(db, user_id)

    def is_current_role(self,role: str) -> bool:
        """
        Returns True if the current user's role matches the given role (case insensitive).
        """
        current_role = get_current_role()
        return current_role.lower() == role.lower()
    
    async def validate_confirmation_token(self, db: AsyncSession, token: str) -> bool:
        await self.user_token_service.get_by_token(db, token, TokenPurpose.CONFIRM_ACCOUNT)

        return True
    
    async def validate_reset_password_token(self, db: AsyncSession, token: str) -> bool:
        await self.user_token_service.get_by_token(db, token, TokenPurpose.RESET_PASSWORD)

        return True
    
    async def check_user_name_availability(self, db: AsyncSession, username: str) -> bool:
        return await self.repository.get_by_username(db, username) is None
    
    async def check_phone_number_availability(self, db: AsyncSession, phone_number: str) -> bool:
        return await self.repository.get_by_phoneNumber(db, phone_number) is None
    
    async def request_password_reset(self, db: AsyncSession, request_password_reset: ResetPasswordRequest) -> None:
        async with db.begin():
            user = await self.repository.get_by_email(db, request_password_reset.email)
            if not user:
                raise AppException(detail="Email no encontrado, por favor verifica tu correo", status_code=404, error_code="USER_NOT_FOUND")

            if await self.user_token_service.has_active_token(db, user.id, TokenPurpose.RESET_PASSWORD):
                raise ValidationException("Ya existe un enlace activo para recuperación de contraseña. Revisa tu correo.")

            user_token = await self.user_token_service.create(db, user.id, TokenPurpose.RESET_PASSWORD)

            reset_password_link = f"{settings.AUTH_USER_LINK}/password?token={user_token.token}"

            await self.email_service.send_password_reset(user.email, f"{user.first_name} {user.last_name}", reset_password_link)

    async def confirm_account(self, db: AsyncSession, token: str, user_account_confirmation: UserAccountConfirmation) -> bool:
        async with db.begin():
            user_id = await self.user_token_service.confirm_token(db, token, expected_purpose=TokenPurpose.CONFIRM_ACCOUNT)

            await self.get_by_id(db, user_id)

            if await self.repository.get_by_username(db, user_account_confirmation.username):
                raise DuplicateEntryError("User", "username")
            
            if await self.repository.get_by_phoneNumber(db, user_account_confirmation.phone_number):
                raise DuplicateEntryError("User", "phone_number")
            
            self.validate_password_strength(user_account_confirmation.password)

            hashed = SecurityHandler.hash_password(user_account_confirmation.password)
            await self.repository.update(db, user_id, {"username": user_account_confirmation.username, "phone_number": user_account_confirmation.phone_number, "password_hash": hashed})

            user_password_history = UserPasswordHistoryCreate(
                user_id=user_id,
                plain_password=user_account_confirmation.password,
                password_hash=hashed
            )

            await self.user_password_history_service.create(db, user_password_history)

            return True
    
    async def change_password(self, db: AsyncSession, token: str, user_change_password: UserChangePassword) -> None:
        async with db.begin():
            user_token = await self.user_token_service.get_by_token(db, token, expected_purpose=TokenPurpose.RESET_PASSWORD)

            user = await self.get_by_id(db, user_token.user_id)
            
            if not SecurityHandler.verify_password(user_change_password.old_password, user.password_hash):
                raise ValidationException("La contraseña antigua es incorrecta.")
            
            self.validate_password_strength(user_change_password.new_password)

            hashed = SecurityHandler.hash_password(user_change_password.new_password)
            await self.repository.update(db, user.id, {"password_hash": hashed})

            await self.user_token_service.confirm_token(db, user_token.token, expected_purpose=TokenPurpose.RESET_PASSWORD)

            user_password_history = UserPasswordHistoryCreate(
                user_id=user.id,
                plain_password=user_change_password.new_password,
                password_hash=hashed
            )

            await self.user_password_history_service.create(db, user_password_history)

    def validate_password_strength(self, password: str) -> None:
        """
        Validates password strength and raises ValidationError with a list of errors if not valid.
        """
        errors = []

        if len(password) < 8:
            errors.append("La contraseña debe tener al menos 8 caracteres.")

        if not re.search(r'[A-Z]', password):
            errors.append("La contraseña debe contener al menos una letra mayúscula.")

        if not re.search(r'\d', password):
            errors.append("La contraseña debe contener al menos un número.")

        if not re.search(r'[^A-Za-z0-9]', password):
            errors.append("La contraseña debe contener al menos un carácter especial.")

        if errors:
            raise ValidationException("\n".join(errors))