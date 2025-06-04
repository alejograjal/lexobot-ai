from typing import List
from pydantic import BaseModel, Field

class CompanyTenantAssignmentCreate(BaseModel):
    company_id: int
    tenant_id: int

class CompanyTenantAssignmentBulkSync(BaseModel):
    company_id: int
    tenant_ids: List[int] = Field(default_factory=list)
