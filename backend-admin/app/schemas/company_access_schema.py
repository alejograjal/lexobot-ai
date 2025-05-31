from datetime import datetime
from pydantic import BaseModel, Field

class CompanyAccessCreate(BaseModel):
    company_id: int
    plan_id: int
    plan_acquisition_date: datetime
    auto_renewal: bool = Field(default=False)

class CompanyAccessUpdate(BaseModel):
    plan_expiration_date: datetime

class CompanyAccessResponse(CompanyAccessCreate):
    id: int
    openai_api_key: str
    issue_at: datetime
    expires_at: datetime
    plan_expiration_date: datetime
    is_active: bool

    class Config:
        from_attributes = True
