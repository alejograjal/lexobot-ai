"""
Schema module initialization.
Provides Pydantic models for request/response validation and serialization.
"""

# Authentication Schemas
from .auth_schema import (
    LoginRequest,
    TokenResponse,
    RefreshTokenRequest,
    ResetPasswordRequest
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
    PasswordValidator,
    UserAccountConfirmation,
    UserChangePassword,
    ChangePasswordRequest
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
    TenantDocumentCount,
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

from .company_user_schema import (
    CompanyUserCreate,
    CompanyUserUpdate,
    CompanyUserBulkSync,
    CompanyUserResponse
)

from .tenant_user_schema import (
    TenantUserCreate,
    TenantUserUpdate,
    TenantUserBulkSync,
    TenantUserResponse
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

from .metrics_schema import (
    MetricsOverviewResponse,
    PeriodCount,
    QuestionCount
)

from .user_password_history_schema import (
    UserPasswordHistoryCreate
)

from .user_token_schema import (
    UserTokenCreate,
    UserTokenUpdate,
    UserTokenResponse
)

from .tenant_plan_assignment_schema import (
    TenantPlanAssignmentCreate,
    TenantPlanAssignmentUpdate,
    TenantPlanAssignmentResponse
)

__all__ = [
    # Authentication
    "LoginRequest",
    "TokenResponse",
    "RefreshTokenRequest",
    "ResetPasswordRequest",
    
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
    "PasswordValidator",
    "UserAccountConfirmation",
    "UserChangePassword",
    "ChangePasswordRequest",

    # Company Access
    "CompanyAccessCreate",
    "CompanyAccessUpdate",
    "CompanyAccessResponse",

    # Plan Category
    "PlanCategoryBase",
    "PlanCategoryCreate",
    "PlanCategoryUpdate",
    "PlanCategoryResponse",

    # Company Tenant Assignment
    "CompanyTenantAssignmentCreate",
    "CompanyTenantAssignmentBulkSync",
    "CompanyTenantAssignmentResponse",

    # Plan
    "PlanBase",
    "PlanCreate",
    "PlanUpdate",
    "PlanResponse",

    # Tenant
    "TenantBase",
    "TenantCreate",
    "TenantUpdate",
    "TenantResponse",

    # Tenant Document
    "TenantDocumentBase",
    "TenantDocumentCount",
    "TenantDocumentCreate",
    "TenantDocumentResponse",

    # Role
    "RoleBase",
    "RoleCreate",
    "RoleUpdate",
    "RoleResponse",
    "RoleResponseProfile",

    # Company User
    "CompanyUserCreate",
    "CompanyUserUpdate",
    "CompanyUserBulkSync",
    "CompanyUserResponse",

    # Tenant User
    "TenantUserCreate",
    "TenantUserUpdate",
    "TenantUserBulkSync",
    "TenantUserResponse",

    # Error Response
    "ErrorResponse",
    "ErrorObject",
    "ValidationErrorDetail",
    "common_errors",
    "not_found_error",
    "validation_error",
    "duplicate_entry_error",

    # Metrics
    "MetricsOverviewResponse",
    "PeriodCount",
    "QuestionCount",

    # User Password History
    "UserPasswordHistoryCreate",

    # User Token
    "UserTokenCreate",
    "UserTokenUpdate",
    "UserTokenResponse",

    # Tenant Plan Assignment
    "TenantPlanAssignmentCreate",
    "TenantPlanAssignmentUpdate",
    "TenantPlanAssignmentResponse"
]