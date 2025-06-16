from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field
from .plan_schema import PlanResponse

class CompanyAccessCreate(BaseModel):
    plan_id: int
    plan_acquisition_date: datetime
    plan_expiration_date: datetime
    auto_renewal: bool = Field(default=False)

class CompanyAccessUpdate(BaseModel):
    plan_id: Optional[int]
    plan_acquisition_date: Optional[datetime]
    plan_expiration_date: Optional[datetime]
    auto_renewal: Optional[bool]

class CompanyAccessResponse(CompanyAccessCreate):
    id: int
    lexobot_worker_api_key: str
    issue_at: datetime
    expires_at: datetime
    plan_expiration_date: datetime
    is_active: bool
    plan: PlanResponse

    class Config:
        from_attributes = True
