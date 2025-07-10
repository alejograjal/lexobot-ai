"""
Core module initialization.
Provides centralized access to core functionality including:
- Security and authentication
- Error handling
- Permissions and roles
- Configuration and settings
- Context management
"""

# Configuration
from .config import settings

# Security
from .security import SecurityConfig, SecurityHandler

# Context Management
from .context import current_user, UserContext
from .user_context_service import get_current_username, get_current_role, get_current_id

# Middleware
from .middleware import AuditMiddleware

# Enums
from .enums import UserRole, TokenPurpose, purpose_labels

# Error Handlers
from .error_handlers import (
    app_exception_handler,
    general_exception_handler,
    authentication_handler,
    validation_exception_handler
)

# Permissions
from .permissions import (
    require_administrator,
    require_company,
    require_tenant,
    require_company_or_admin,
    require_company_or_tenant,
    require_any_role
)

# Exceptions
from .exceptions import (
    AppException,
    NotFoundException,
    DuplicateEntryError,
    AccountLockedError,
    InsufficientPermissionsError,
    AppAuthException,
    InvalidCredentialsError,
    ForbiddenError,
    ValidationException,
    InvalidTokenError,
    TenantUploadError,
    UploadToTenantWorkerError,
    DuplicatePasswordError,
    InvalidAccountTokenError
)

__all__ = [
    # Configuration
    "settings",
    
    # Security
    "SecurityConfig",
    "SecurityHandler",
    
    # Context
    "current_user",
    "UserContext",
    "get_current_username",
    "get_current_role",
    "get_current_id",
    
    # Middleware
    "AuditMiddleware",
    
    # Enums
    "UserRole",
    
    # Error Handlers
    "app_exception_handler",
    "general_exception_handler",
    "authentication_handler",
    "validation_exception_handler",
    
    # Permissions
    "require_administrator",
    "require_company",
    "require_tenant",
    "require_company_or_admin",
    "require_company_or_tenant",
    "require_any_role",
    
    # Exceptions
    "AppException",
    "NotFoundException",
    "DuplicateEntryError",
    "AccountLockedError",
    "InsufficientPermissionsError",
    "AppAuthException",
    "InvalidCredentialsError",
    "ForbiddenError",
    "ValidationException",
    "InvalidTokenError",
    "TenantUploadError",
    "UploadToTenantWorkerError",
    "DuplicatePasswordError",
    "InvalidAccountTokenError"
]