from .base import BaseModel
from sqlalchemy.orm import relationship
from sqlalchemy import Column, Integer, ForeignKey, DateTime, func, Boolean

class TenantPlanAssignment(BaseModel):
    __tablename__ = 'tenant_plan_assignments'

    tenant_id = Column(Integer, ForeignKey('tenants.id'), nullable=False, unique=True)
    plan_id = Column(Integer, ForeignKey('plans.id'), nullable=False)
    assigned_at = Column(DateTime(timezone=True), server_default=func.now())
    expires_at = Column(DateTime(timezone=True), nullable=False)

    auto_renewal = Column(Boolean, default=False, nullable=False)

    tenant = relationship("Tenant", backref="access", lazy="selectin")
    plan = relationship("Plan", lazy="selectin")