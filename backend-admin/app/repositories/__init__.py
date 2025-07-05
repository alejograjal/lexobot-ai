"""
Repository module initialization.
Provides centralized access to all data access repositories.
"""

from .base import BaseRepository
from .user_repository import UserRepository
from .role_repository import RoleRepository
from .plan_repository import PlanRepository
from .tenant_repository import TenantRepository
from .company_repository import CompanyRepository
from .tenant_user_repository import TenantUserRepository
from .company_user_repository import CompanyUserRepository
from .plan_category_repository import PlanCategoryRepository
from .login_attempt_repository import LoginAttemptRepository
from .company_access_repository import CompanyAccessRepository
from .tenant_document_repository import TenantDocumentRepository
from .company_tenant_assignment_repository import CompanyTenantAssignmentRepository

__all__ = [
    # Base Repository
    "BaseRepository",
    
    # Domain Repositories
    "UserRepository",
    "CompanyRepository",
    "LoginAttemptRepository",

    # Company Access Repository
    "CompanyAccessRepository",

    # Tenant User Repository
    "TenantUserRepository",

    # Company User Repository
    "CompanyUserRepository",

    # Plan Category Repository
    "PlanCategoryRepository",

    # Company Tenant Assignment Repository
    "CompanyTenantAssignmentRepository",

    # Plan Repository
    "PlanRepository",

    # Tenant Repository
    "TenantRepository",

    # Tenant Document Repository
    "TenantDocumentRepository",

    # Role Repository
    "RoleRepository"
]