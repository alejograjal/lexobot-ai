from .base import BaseModel
from sqlalchemy import (Column, String)

class PlanCategory(BaseModel):
    __tablename__ = 'plan_categories'
    name = Column(String(100), nullable=False)
    description = Column(String(255), nullable=False)