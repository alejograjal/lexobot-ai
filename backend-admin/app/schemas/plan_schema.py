from typing import Optional
from decimal import Decimal
from pydantic import BaseModel, Field
from .plan_category_schema import PlanCategoryResponse

class PlanBase(BaseModel):
    plan_category_id: int
    name: str
    max_tenants: int
    base_price: Decimal = Field(..., max_digits=10, decimal_places=2)

class PlanCreate(PlanBase):
    pass

class PlanUpdate(BaseModel):
    plan_category_id: Optional[int] = None
    name: Optional[str] = None
    max_tenants: Optional[int] = None
    base_price: Optional[Decimal] = Field(default=None, max_digits=10, decimal_places=2)

class PlanResponse(PlanBase):
    id: int
    is_active: bool
    plan_category: PlanCategoryResponse
    
    class Config:
        from_attributes = True
