from typing import Optional
from pydantic import BaseModel, Field

class PlanCategoryBase(BaseModel):
    name: str = Field(..., max_length=100)
    description: str = Field(..., max_length=255)

class PlanCategoryCreate(PlanCategoryBase):
    pass

class PlanCategoryUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=100)
    description: Optional[str] = Field(None, max_length=255)

class PlanCategoryResponse(PlanCategoryBase):
    id: int
    is_active: bool

    class Config:
        from_attributes = True
