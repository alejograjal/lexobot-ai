"""
API v1 route initialization module.
This module imports and exposes all route modules for the v1 API.
"""

from fastapi import APIRouter
from .auth_routes import router as auth_router
from .company_routes import router as company_router

v1_router = APIRouter(prefix="/v1")

v1_router.include_router(auth_router)
v1_router.include_router(company_router)

__all__ = ["v1_router"]