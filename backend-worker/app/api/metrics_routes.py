from datetime import datetime
from app.utils import get_tenant_secret
from app.schemas import QuestionMetricsResponse
from app.services.qa import get_metrics_summary
from fastapi import Query, Depends, APIRouter, Header
from app.services.auth.hmac_validator_service import HMACValidatorService

router = APIRouter(prefix="/api/metrics", tags=["Tenant Metrics"])

hmac_validator = HMACValidatorService(secret_provider=get_tenant_secret)

def validate_signature(
    company_access_id: str = Header(..., alias="X-Company-Access-Id"),
    timestamp: str = Header(..., alias="X-Timestamp"),
    signature: str = Header(..., alias="X-Signature")
) -> None:
    hmac_validator.validate(company_access_id, timestamp, signature)

@router.get(
    "/{tenant_id}",
    response_model=QuestionMetricsResponse,
    summary="Get QA metrics",
    description="Obtain question metrics over a date range"
)
async def get_question_metrics(
    tenant_id: str,
    start_date: datetime = Query(..., description="Start of the date range"),
    end_date: datetime = Query(..., description="End of the date range"),
    limit: int = Query(10, ge=1, le=50, description="Top N questions to retrieve"),
    _ = Depends(validate_signature)
) -> QuestionMetricsResponse:
    
    metrics = await get_metrics_summary(
        tenant_id=tenant_id,
        start=start_date.date(),
        end=end_date.date(),
        limit=limit
    )

    return QuestionMetricsResponse(**metrics)
