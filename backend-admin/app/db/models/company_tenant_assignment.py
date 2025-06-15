from .base import BaseModel
from sqlalchemy.orm import relationship
from sqlalchemy import (Column, Integer, ForeignKey, UniqueConstraint)

class CompanyTenantAssignment(BaseModel):
    __tablename__ = 'company_tenant_assignments'
    company_id = Column(Integer, ForeignKey('companies.id'), nullable=False)
    tenant_id = Column(Integer, ForeignKey('tenants.id'), nullable=False)

    company = relationship("Company", backref="assigned_tenants", lazy="selectin")
    tenant = relationship("Tenant", backref="assigned_companies", lazy="selectin")

    __table_args__ = (
        UniqueConstraint('company_id', 'tenant_id', name='_company_tenant_uc'),
    )