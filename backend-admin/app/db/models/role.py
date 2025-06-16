from .base import BaseModel
from sqlalchemy import Column, String

class Role(BaseModel):
    __tablename__ = 'roles'
    name = Column(String(50), unique=True, nullable=False)
    description = Column(String(255), nullable=False)