"""
Schema module initialization.
Provides Pydantic models for request/response validation and serialization.
"""

# Authentication Schemas
from .auth_schema import (
    LoginRequest,
    TokenResponse,
    RefreshTokenRequest
)

# Company Schemas
from .company_schema import (
    CompanyBase,
    CompanyCreate,
    CompanyUpdate,
    CompanyResponse
)

# User Schemas
from .user_schema import (
    UserBase,
    UserCreate,
    UserUpdate,
    UserResponse,
    PasswordValidator
)

__all__ = [
    # Authentication
    "LoginRequest",
    "TokenResponse",
    "RefreshTokenRequest",
    
    # Company
    "CompanyBase",
    "CompanyCreate",
    "CompanyUpdate",
    "CompanyResponse",
    
    # User
    "UserBase",
    "UserCreate",
    "UserUpdate",
    "UserResponse",
    "PasswordValidator"
]