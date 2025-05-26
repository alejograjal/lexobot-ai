"""
Main API router configuration.
Centralizes all API versions and their routes.
"""
from fastapi import APIRouter
from app.api.v1 import v1_router

api_router = APIRouter()

api_router.include_router(v1_router)

__all__ = ["api_router"]