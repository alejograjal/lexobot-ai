"""
API module initialization.
Provides access to all API routes and endpoints.
"""

from fastapi import APIRouter
from .routes import router as qa_router
from .token_routes import router as token_router
from .access_routes import router as access_router
from .document_routes import router as document_router

# Create main API router
api_router = APIRouter()

# Include all route modules
api_router.include_router(qa_router, tags=["QA"])
api_router.include_router(token_router, tags=["Token Usage"])
api_router.include_router(access_router, tags=["Tenant Tokens"])
api_router.include_router(document_router, tags=["Tenant Upload"])

__all__ = ["api_router"]