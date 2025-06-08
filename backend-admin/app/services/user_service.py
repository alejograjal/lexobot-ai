from typing import Optional
from app.core import UserRole
from app.db.models import User
from app.core import SecurityHandler
from app.core import get_current_role
from app.repositories import UserRepository
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas import UserCreate, UserUpdate, PasswordValidator
from app.core import DuplicateEntryError, NotFoundException, ValidationException

class UserService:
    def __init__(self):
        self.repository = UserRepository()

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
        user_role = get_current_role()

        if self.is_current_role(UserRole.COMPANY.value) and user_data.role_id in [ UserRole.COMPANY.value, UserRole.ADMINISTRATOR.value ]:
            raise ValidationException("You are not allowed to assign this role.")

        if not PasswordValidator.validate_password_pattern(user_data.password):
            raise ValidationException(
                "Password must contain at least one uppercase letter, "
                "one lowercase letter, one number and one special character"
            )

        if await self.repository.get_by_username(db, user_data.username):
            raise DuplicateEntryError("User", "username")
        
        if await self.repository.get_by_email(db, user_data.email):
            raise DuplicateEntryError("User", "email")
        
        hashed_password = SecurityHandler.hash_password(user_data.password)
        user_dict = user_data.dict()
        user_dict["hashed_password"] = hashed_password
        del user_dict["password"]

        return await self.repository.create(db, user_dict)

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

        if current_user.role_id != update_data.role_id:
            if self.is_current_role(UserRole.COMPANY.value) and update_data.role_id in [UserRole.COMPANY.value, UserRole.ADMINISTRATOR.value]:
                raise ValidationException("You are not allowed to assign this role.")

        if user_data.password and not PasswordValidator.validate_password_pattern(user_data.password):
            raise ValidationException(
                "Password must contain at least one uppercase letter, "
                "one lowercase letter, one number and one special character"
            )
        
        if "username" in update_data:
            existing = await self.repository.get_by_username(db, update_data["username"])
            if existing and existing.id != user_id:
                raise DuplicateEntryError("User", "username")
        
        if "email" in update_data:
            existing = await self.repository.get_by_email(db, update_data["email"])
            if existing and existing.id != user_id:
                raise DuplicateEntryError("User", "email")
            
        if user_data.password:
            update_data["hashed_password"] = SecurityHandler.hash_password(user_data.password)
            del update_data["password"]
        
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

    def is_current_role(role: str) -> bool:
        """
        Returns True if the current user's role matches the given role (case insensitive).
        """
        current_role = get_current_role()
        return current_role.lower() == role.lower()