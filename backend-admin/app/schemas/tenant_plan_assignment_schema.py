from typing import Optional
from datetime import datetime
from pydantic import BaseModel
from .plan_schema import PlanResponse

class TenantPlanAssignmentBase(BaseModel):
    plan_id: int
    expires_at: datetime
    auto_renewal: bool

class TenantPlanAssignmentCreate(TenantPlanAssignmentBase):
    assigned_at: datetime

class TenantPlanAssignmentUpdate(TenantPlanAssignmentBase):
    pass

class TenantPlanAssignmentResponse(TenantPlanAssignmentBase):
    id: int
    tenant_id: int
    assigned_at: datetime

    plan: PlanResponse

    class Config:
        from_attributes = True