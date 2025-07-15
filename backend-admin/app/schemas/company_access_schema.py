from typing import Optional
from datetime import datetime
from pydantic import BaseModel

class CompanyAccessBase(BaseModel):
    issue_at: datetime
    expires_at: datetime

class CompanyAccessCreate(CompanyAccessBase):
    pass

class CompanyAccessUpdate(BaseModel):
    expires_at: Optional[datetime]

class CompanyAccessResponse(CompanyAccessBase):
    id: int
    lexobot_worker_api_key: str

    class Config:
        from_attributes = True
