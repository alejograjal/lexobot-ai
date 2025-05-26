import re
from typing import Optional, Annotated
from pydantic import BaseModel, EmailStr, Field

PASSWORD_PATTERN = r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,64}$"

class PasswordValidator:
    @classmethod
    def validate_password_pattern(cls, password: str) -> bool:
        return bool(re.match(PASSWORD_PATTERN, password))

class UserBase(BaseModel):
    first_name: Annotated[str, Field(max_length=100)]
    last_name: Annotated[str, Field(max_length=100)]
    email: EmailStr
    phone_number: Optional[Annotated[str, Field(max_length=20)]] = None
    username: Annotated[str, Field(min_length=3, max_length=50)]
    role_id: int

class UserCreate(UserBase):
    password: Annotated[str, Field(
        min_length=8, 
        max_length=64,
        description="Password must contain at least one uppercase letter, one lowercase letter, one number and one special character"
    )]

class UserUpdate(BaseModel):
    first_name: Optional[Annotated[str, Field(max_length=100)]] = None
    last_name: Optional[Annotated[str, Field(max_length=100)]] = None
    email: Optional[EmailStr] = None
    phone_number: Optional[Annotated[str, Field(max_length=20)]] = None
    username: Optional[Annotated[str, Field(min_length=3, max_length=50)]] = None
    role_id: Optional[int] = None
    password: Optional[Annotated[str, Field(
        min_length=8, 
        max_length=64,
        description="Password must contain at least one uppercase letter, one lowercase letter, one number and one special character"
    )]] = None

class UserResponse(UserBase):
    id: int
    is_active: bool

    class Config:
        from_attributes = True