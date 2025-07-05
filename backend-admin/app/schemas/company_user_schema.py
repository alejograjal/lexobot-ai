from typing import List
from pydantic import BaseModel, Field
from .company_schema import CompanyResponse
from .user_schema import UserResponse, UserCreate, UserUpdate

class CompanyUserCreate(BaseModel):
    user: UserCreate
    assign: bool

class CompanyUserUpdate(BaseModel):
    user: UserUpdate
    assign: bool

class CompanyUserBulkSync(BaseModel):
    assign: bool
    user_ids: List[int] = Field(default_factory=list)

class CompanyUserResponse(BaseModel):
    id: int
    company_id: int
    user_id: int
    assign: bool
    company: CompanyResponse
    user: UserResponse
