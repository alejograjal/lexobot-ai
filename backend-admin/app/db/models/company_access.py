from .base import BaseModel
from sqlalchemy.orm import relationship
from sqlalchemy import (Column, Integer, String, Boolean, DateTime, ForeignKey, func)

class CompanyAccess(BaseModel):
    __tablename__ = 'company_accesses'
    company_id = Column(Integer, ForeignKey('companies.id'), nullable=False)
    openai_api_key = Column(String(255), unique=True, nullable=False, index=True)
    issue_at = Column(DateTime(timezone=True), server_default=func.now())
    expires_at = Column(DateTime(timezone=True), nullable=False)

    plan_id = Column(Integer, ForeignKey('plans.id'), nullable=False)
    plan_acquisition_date = Column(DateTime(timezone=True), nullable=False)
    plan_expiration_date = Column(DateTime(timezone=True), nullable=False)
    auto_renewal = Column(Boolean, default=False, nullable=False)

    company = relationship("Company", backref="accesses")
    plan = relationship("Plan")