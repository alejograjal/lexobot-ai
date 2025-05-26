from .base import BaseModel
from sqlalchemy.orm import relationship
from sqlalchemy import (Column, Integer, String, Numeric, ForeignKey)

class Plan(BaseModel):
    __tablename__ = 'plans'

    plan_category_id = Column(Integer, ForeignKey('plan_categories.id'), nullable=False)
    name = Column(String(100), nullable=False)
    max_tenants = Column(Integer, nullable=False) 
    base_price = Column(Numeric(10, 2), nullable=False)

    plan_category = relationship("PlanCategory", backref="plans")