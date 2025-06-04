import uuid
from typing import Optional
from pydantic import BaseModel, EmailStr

class TenantBase(BaseModel):
    name: str
    contact_name: str
    contact_email: EmailStr
    client_count: int = 0

class TenantCreate(TenantBase):
    pass

class TenantUpdate(BaseModel):
    name: Optional[str] = None
    contact_name: Optional[str] = None
    contact_email: Optional[EmailStr] = None
    client_count: Optional[int] = None

class TenantResponse(TenantBase):
    id: int
    external_id: uuid.UUID