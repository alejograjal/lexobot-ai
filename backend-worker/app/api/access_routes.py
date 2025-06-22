from app.utils import get_tenant_secret
from app.services.tenant import TenantAuthService
from fastapi import APIRouter, Query, HTTPException

router = APIRouter(prefix="/token", tags=["Tenant Tokens"])
auth_service = TenantAuthService(secret_provider=get_tenant_secret)

@router.get("/hmac", summary="Generate HMAC token for tenant")
async def generate_hmac_token(
    company_access_id: str = Query(...),
    ttl: int = Query(60, gt=0, le=300)
):
    try:
        return auth_service.generate_token(company_access_id, ttl_seconds=ttl)
    except Exception:
        raise HTTPException(status_code=400, detail="Unable to generate token")