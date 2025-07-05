from app.core import AppException
from sqlalchemy.ext.asyncio import AsyncSession
from app.clients.tenant_api_client import TenantApiClient
from app.services import CompanyTenantAssignmentService, CompanyAccessService

class MetricsService:
    def __init__(self):
        self.tenant_api_client = TenantApiClient()
        self.company_tenant_assignment_service = CompanyTenantAssignmentService()
        self.company_access_service = CompanyAccessService()
    
    async def get_metrics(self, db: AsyncSession, tenant_id: int, start_date: str, end_date: str):
        tenant_assigned = await self.company_tenant_assignment_service.get_all_by_tenant(db, tenant_id)
        if not tenant_assigned or len(tenant_assigned) == 0:
            raise AppException(detail="Tenant no asignado", status_code=404, error_code="TENANT_NOT_FOUND")

        company_worker_id = await self.company_access_service.get_company_worker_id(db, tenant_assigned[0].company_id)

        try:
            async with TenantApiClient() as client:
                return await client.get_metrics(
                    company_access_id=str(company_worker_id),
                    external_id=str(tenant_assigned[0].tenant.external_id),
                    start_date=start_date,
                    end_date=end_date
                )
        except Exception as e:
            raise AppException(
                detail=f"Se ha producido un error al obtener las métricas.",
                status_code=500,
                error_code="METRICS_ERROR"
            ) from e
        
    async def get_metrics_overall(self, db: AsyncSession, tenant_id: int):
        tenant_assigned = await self.company_tenant_assignment_service.get_all_by_tenant(db, tenant_id)
        if not tenant_assigned or len(tenant_assigned) == 0:
            raise AppException(detail="Tenant no asignado", status_code=404, error_code="TENANT_NOT_FOUND")

        company_worker_id = await self.company_access_service.get_company_worker_id(db, tenant_assigned[0].company_id)

        try:
            async with TenantApiClient() as client:
                return await client.get_metrics_overall(
                    company_access_id=str(company_worker_id),
                    external_id=str(tenant_assigned[0].tenant.external_id)
                )
        except Exception as e:
            raise AppException(
                detail=f"Se ha producido un error al obtener las métricas overall.",
                status_code=500,
                error_code="METRICS_ERROR_OVERALL"
            ) from e

    async def get_metrics_grouped_by_period(self, db: AsyncSession, tenant_id: int, period: str):
        tenant_assigned = await self.company_tenant_assignment_service.get_all_by_tenant(db, tenant_id)
        if not tenant_assigned or len(tenant_assigned) == 0:
            raise AppException(detail="Tenant no asignado", status_code=404, error_code="TENANT_NOT_FOUND")

        company_worker_id = await self.company_access_service.get_company_worker_id(db, tenant_assigned[0].company_id)

        try:
            async with TenantApiClient() as client:
                return await client.get_metrics_grouped_by_period(
                    company_access_id=str(company_worker_id),
                    external_id=str(tenant_assigned[0].tenant.external_id),
                    period=period
                )
        except Exception as e:
            raise AppException(
                detail=f"Se ha producido un error al obtener las métricas agrupadas por período.",
                status_code=500,
                error_code="METRICS_ERROR_BY_PERIOD"
            ) from e
