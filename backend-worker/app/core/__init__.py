"""
Core module initialization.
Provides centralized access to core functionality including:
- Configuration settings
"""

from .config import settings
from .exceptions import TenantNotFoundError, CompanyNotFoundError, InvalidHMACSignatureError, TokenExpiredError, DocumentNotFoundForVectorstoreError, TenantConfigNotFoundError, TenantDocumentNotFoundError

__all__ = [
    # Configuration
    "settings",

    # Exceptions
    "TenantNotFoundError",
    "CompanyNotFoundError",
    "InvalidHMACSignatureError",
    "TokenExpiredError",
    "DocumentNotFoundForVectorstoreError",
    "TenantConfigNotFoundError",
    "TenantDocumentNotFoundError"
]