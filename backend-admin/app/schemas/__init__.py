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
    UserProfile,
    PasswordValidator
)

from .company_access_schema import (
    CompanyAccessCreate,
    CompanyAccessUpdate,
    CompanyAccessResponse
)

from .plan_category_schema import (
    PlanCategoryBase,
    PlanCategoryCreate,
    PlanCategoryUpdate,
    PlanCategoryResponse
)

from .company_tenant_assignment_schema import (
    CompanyTenantAssignmentCreate,
    CompanyTenantAssignmentBulkSync,
    CompanyTenantAssignmentResponse
)

from .plan_schema import (
    PlanBase,
    PlanCreate,
    PlanUpdate,
    PlanResponse
)

from .tenant_schema import (
    TenantBase,
    TenantCreate,
    TenantUpdate,
    TenantResponse
)

from .tenant_document_schema import (
    TenantDocumentBase,
    TenantDocumentCreate,
    TenantDocumentResponse
)

from .role_schema import (
    RoleBase,
    RoleCreate,
    RoleUpdate,
    RoleResponse,
    RoleResponseProfile
)

from .error_response_schema import (
    ErrorResponse,
    ErrorObject,
    ValidationErrorDetail,
    common_errors,
    not_found_error,
    validation_error,
    duplicate_entry_error
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
    "UserProfile",
    "PasswordValidator"

    # Company Access
    "CompanyAccessCreate",
    "CompanyAccessUpdate",
    "CompanyAccessResponse"

    # Plan Category
    "PlanCategoryBase",
    "PlanCategoryCreate",
    "PlanCategoryUpdate",
    "PlanCategoryResponse"

    # Company Tenant Assignment
    "CompanyTenantAssignmentCreate",
    "CompanyTenantAssignmentBulkSync",
    "CompanyTenantAssignmentResponse"

    # Plan
    "PlanBase",
    "PlanCreate",
    "PlanUpdate",
    "PlanResponse"

    # Tenant
    "TenantBase",
    "TenantCreate",
    "TenantUpdate",
    "TenantResponse"

    # Tenant Document
    "TenantDocumentBase",
    "TenantDocumentCreate",
    "TenantDocumentResponse"

    # Role
    "RoleBase",
    "RoleCreate",
    "RoleUpdate",
    "RoleResponse",
    "RoleResponseProfile"

    # Error Response
    "ErrorResponse",
    "ErrorObject",
    "ValidationErrorDetail",
    "common_errors",
    "not_found_error",
    "validation_error",
    "duplicate_entry_error"
]