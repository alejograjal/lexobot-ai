from .base import BaseModel
from sqlalchemy import Column, Integer, String

class Company(BaseModel):
    __tablename__ = 'companies'
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    legal_id = Column(String(100), unique=True, nullable=False)
    address = Column(String(255), nullable=False)
    phone = Column(String(50), nullable=False)
    billing_email = Column(String(255), nullable=False)
    managed_tenants_count = Column(Integer, default=0, nullable=False)