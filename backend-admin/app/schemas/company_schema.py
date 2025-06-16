from typing import Optional, Annotated
from pydantic import BaseModel, EmailStr, Field

class CompanyBase(BaseModel):
    name: Annotated[str, Field(max_length=255)]
    email: EmailStr
    legal_id: Annotated[str, Field(max_length=100)]
    address: Annotated[str, Field(max_length=255)]
    phone: Annotated[str, Field(max_length=50)]
    billing_email: EmailStr
    managed_tenants_count: int = Field(default=0)

class CompanyCreate(CompanyBase):
    pass

class CompanyUpdate(BaseModel):
    name: Optional[Annotated[str, Field(max_length=255)]] = None
    email: Optional[EmailStr] = None
    legal_id: Optional[Annotated[str, Field(max_length=100)]] = None
    address: Optional[Annotated[str, Field(max_length=255)]] = None
    phone: Optional[Annotated[str, Field(max_length=50)]] = None
    billing_email: Optional[EmailStr] = None
    managed_tenants_count: Optional[int] = None

class CompanyResponse(CompanyBase):
    id: int
    is_active: bool

    class Config:
        from_attributes = True