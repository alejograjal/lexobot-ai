"""
API v1 route initialization module.
This module imports and exposes all route modules for the v1 API.
"""

from fastapi import APIRouter
from .me_routes import router as me_router
from .plan_routes import router as plan_router
from .auth_routes import router as auth_router
from .user_routes import router as user_router
from .role_routes import router as role_router
from .tenant_routes import router as tenant_router
from .company_routes import router as company_router
from .account_routes import router as account_router
from .plan_category_routes import router as plan_category_router
from .company_access_routes import router as company_access_router
from .tenant_document_routes import router as tenant_document_router
from .tenant_plan_assignment_routes import router as tenant_plan_assignment_router
from .company_tenant_assignment_routes import router as company_tenant_assignment_router

v1_router = APIRouter(prefix="/v1")

v1_router.include_router(me_router)
v1_router.include_router(auth_router)
v1_router.include_router(company_access_router)
v1_router.include_router(company_router)
v1_router.include_router(company_tenant_assignment_router)
v1_router.include_router(plan_category_router)
v1_router.include_router(plan_router)
v1_router.include_router(role_router)
v1_router.include_router(tenant_document_router)
v1_router.include_router(tenant_router)
v1_router.include_router(user_router)
v1_router.include_router(tenant_plan_assignment_router)
v1_router.include_router(account_router)

__all__ = ["v1_router"]