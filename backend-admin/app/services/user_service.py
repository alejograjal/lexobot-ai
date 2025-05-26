from typing import Optional
from app.db.models import User
from app.core import SecurityHandler
from app.repositories import UserRepository
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas import UserCreate, UserUpdate, PasswordValidator
from app.core import DuplicateEntryError, NotFoundException, ValidationException

class UserService:
    def __init__(self):
        self.repository = UserRepository()

    async def get_by_id(self, db: AsyncSession, user_id: int) -> Optional[User]:
        return await self.repository.get_by_id(db, user_id, False)

    async def get_by_username(self, db: AsyncSession, username: str) -> Optional[User]:
        """
        Get a user by username. Returns None if user doesn't exist or is inactive
        """
        return await self.repository.get_by_username(db, username)

    async def create_user(self, db: AsyncSession, user_data: UserCreate) -> User:
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

        return await self.repository.create(user_dict)

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
            existing = self.repository.get_by_email(db, update_data["email"])
            if existing and existing.id != user_id:
                raise DuplicateEntryError("User", "email")
            
        if user_data.password:
            update_data["hashed_password"] = SecurityHandler.hash_password(user_data.password)
            del update_data["password"]
        
        return await self.repository.update(db, user_id, update_data)