import re
from typing import Optional, Annotated
from .role_schema import RoleResponseProfile
from pydantic import BaseModel, EmailStr, Field, computed_field

PASSWORD_PATTERN = r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,64}$"

class PasswordValidator:
    @classmethod
    def validate_password_pattern(cls, password: str) -> bool:
        return bool(re.match(PASSWORD_PATTERN, password))

class UserBase(BaseModel):
    first_name: Annotated[str, Field(max_length=100)]
    last_name: Annotated[str, Field(max_length=100)]
    email: EmailStr
    role_id: int

class UserCreate(UserBase):
    pass

class UserUpdate(BaseModel):
    first_name: Optional[Annotated[str, Field(max_length=100)]] = None
    last_name: Optional[Annotated[str, Field(max_length=100)]] = None
    email: Optional[EmailStr] = None
    phone_number: Optional[Annotated[str, Field(max_length=20)]] = None
    username: Optional[Annotated[str, Field(min_length=3, max_length=50)]] = None
    role_id: Optional[int] = None

class UserAccountConfirmation(BaseModel):
    username: Annotated[str, Field(min_length=3, max_length=50)]
    phone_number: Annotated[str, Field(max_length=20)]
    password: Annotated[str, Field(min_length=8, max_length=50)]

class UserChangePassword(BaseModel):
    old_password: Annotated[str, Field(min_length=8, max_length=50)]
    new_password: Annotated[str, Field(min_length=8, max_length=50)]

class UserResponse(UserBase):
    id: int
    username: Optional[str]
    phone_number: Optional[str]
    is_active: bool

    @computed_field
    @property
    def full_name(self) -> str:
        return f"{self.first_name} {self.last_name}"


class UserProfile(BaseModel):
    id: int
    username: str
    first_name: str
    last_name: str
    email: EmailStr
    phone_number: Optional[str] = None
    role: RoleResponseProfile

    @computed_field
    @property
    def full_name(self) -> str:
        return f"{self.first_name} {self.last_name}"