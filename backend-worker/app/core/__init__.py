"""
Core module initialization.
Provides centralized access to core functionality including:
- Configuration settings
"""

from .config import settings
from .redis_client import redis_client
from .exceptions import TenantNotFoundError, CompanyNotFoundError, InvalidHMACSignatureError, TokenExpiredError, DocumentNotFoundForVectorstoreError, TenantConfigNotFoundError, TenantDocumentNotFoundError, BillingError, TokenLimitError

__all__ = [
    # Configuration
    "settings",

    # Redis Client
    "redis_client",

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