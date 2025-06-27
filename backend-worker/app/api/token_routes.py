from app.utils import get_tenant_secret
from app.services.billing import get_token_usage_info
from fastapi import APIRouter, Header, Depends, status, Query
from app.services.auth.hmac_validator_service import HMACValidatorService

router = APIRouter(prefix="/api", tags=["Token Usage"])

hmac_validator = HMACValidatorService(secret_provider=get_tenant_secret)

def validate_signature(
    company_access_id: str = Header(..., alias="X-Company-Access-Id"),
    timestamp: str = Header(..., alias="X-Timestamp"),
    signature: str = Header(..., alias="X-Signature")
) -> None:
    hmac_validator.validate(company_access_id, timestamp, signature)

@router.get("/token-usage", status_code=status.HTTP_200_OK)
async def token_usage(
    external_id: str = Query(..., description="External tenant identifier"),
    _ = Depends(validate_signature)
):
    return await get_token_usage_info(external_id)
