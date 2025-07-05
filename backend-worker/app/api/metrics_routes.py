from typing import Literal, List
from app.utils import get_tenant_secret
from fastapi import Query, Depends, APIRouter, Header
from app.schemas import MetricsOverviewResponse, PeriodCount
from app.services.qa import get_metrics_overall, get_metrics_grouped_by_period
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
    "/overview",
    response_model=MetricsOverviewResponse,
    summary="Get overall metrics for a tenant",
    description="Total questions and top N questions for a tenant"
)
async def get_metrics_overview(
    tenant_id: str,
    limit: int = Query(10, ge=1, le=50, description="Top N questions"),
    _ = Depends(validate_signature)
):
    result = await get_metrics_overall(tenant_id, limit)
    return result

@router.get(
    "/grouped",
    response_model=List[PeriodCount],
    summary="Get metrics grouped by period",
    description="Daily, weekly or monthly question count"
)
async def get_metrics_grouped(
    tenant_id: str,
    period: Literal["day", "week", "month"] = Query(..., description="Grouping period"),
    _ = Depends(validate_signature)
):
    return await get_metrics_grouped_by_period(tenant_id, period)

# @router.get(
#     "/{tenant_id}",
#     response_model=QuestionMetricsResponse,
#     summary="Get QA metrics",
#     description="Obtain question metrics over a date range"
# )
# async def get_question_metrics(
#     tenant_id: str,
#     start_date: datetime = Query(..., description="Start of the date range"),
#     end_date: datetime = Query(..., description="End of the date range"),
#     limit: int = Query(10, ge=1, le=50, description="Top N questions to retrieve"),
#     _ = Depends(validate_signature)
# ) -> QuestionMetricsResponse:
    
#     metrics = await get_metrics_summary(
#         tenant_id=tenant_id,
#         start=start_date.date(),
#         end=end_date.date(),
#         limit=limit
#     )

#     return QuestionMetricsResponse(**metrics)
