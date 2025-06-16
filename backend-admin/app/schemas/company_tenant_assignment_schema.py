from typing import List
from pydantic import BaseModel, Field
from .tenant_schema import TenantResponse
from .company_schema import CompanyResponse

class CompanyTenantAssignmentCreate(BaseModel):
    company_id: int
    tenant_id: int

class CompanyTenantAssignmentBulkSync(BaseModel):
    company_id: int
    tenant_ids: List[int] = Field(default_factory=list)

class CompanyTenantAssignmentResponse(BaseModel):
    id: int
    company_id: int
    tenant_id: int
    company: CompanyResponse
    tenant: TenantResponse

