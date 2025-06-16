"""
Core module initialization.
Provides centralized access to core functionality including:
- Configuration settings
"""

from .config import settings
from .exceptions import TenantNotFoundError

__all__ = [
    # Configuration
    "settings",

    # Exceptions
    "TenantNotFoundError"
]