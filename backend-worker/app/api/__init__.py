"""
API module initialization.
Provides access to all API routes and endpoints.
"""

from fastapi import APIRouter
from .routes import router as qa_router

# Create main API router
api_router = APIRouter()

# Include all route modules
api_router.include_router(qa_router, tags=["QA"])

__all__ = ["api_router"]