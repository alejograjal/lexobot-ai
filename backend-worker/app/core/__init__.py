"""
Core module initialization.
Provides centralized access to core functionality including:
- Configuration settings
"""

from .config import settings
from .exceptions import TenantNotFoundError, CompanyNotFoundError, InvalidHMACSignatureError, TokenExpiredError, DocumentNotFoundForVectorstoreError, TenantConfigNotFoundError, TenantDocumentNotFoundError, BillingError, TokenLimitError

__all__ = [
    # Configuration
    "settings",

    # Exceptions
    "LexoBotAIAPIError",
    "TenantNotFoundError",
    "CompanyNotFoundError",
    "InvalidHMACSignatureError",
    "TokenExpiredError",
    "DocumentNotFoundForVectorstoreError",
    "TenantConfigNotFoundError",
    "TenantDocumentNotFoundError",
    "BillingError",
    "TokenLimitError"
]