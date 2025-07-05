from typing import List
from pydantic import BaseModel, Field
from .tenant_schema import TenantResponse
from .user_schema import UserResponse, UserCreate, UserUpdate

class TenantUserCreate(BaseModel):
    user: UserCreate
    assign: bool

class TenantUserUpdate(BaseModel):
    user: UserUpdate
    assign: bool

class TenantUserBulkSync(BaseModel):
    assign: bool
    user_ids: List[int] = Field(default_factory=list)

class TenantUserResponse(BaseModel):
    id: int
    tenant_id: int
    user_id: int
    assign: bool
    tenant: TenantResponse
    user: UserResponse