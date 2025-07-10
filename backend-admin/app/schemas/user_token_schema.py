from typing import Optional
from datetime import datetime
from pydantic import BaseModel
from app.core import TokenPurpose

class UserTokenBase(BaseModel):
    user_id: int
    purpose: TokenPurpose
    expires_at: datetime

class UserTokenCreate(UserTokenBase):
    token: str

class UserTokenUpdate(BaseModel):
    used: Optional[bool] = None

class UserTokenResponse(UserTokenBase):
    id: int
    token: str
    used: bool

    class Config:
        from_attributes = True