from .base import BaseModel
from sqlalchemy.orm import relationship
from sqlalchemy import (Column, Integer, ForeignKey, UniqueConstraint, Boolean, false)

class TenantUser(BaseModel):
    __tablename__ = 'tenant_users'
    tenant_id = Column(Integer, ForeignKey('tenants.id'), nullable=False)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    assign = Column(Boolean, default=True, server_default=false(), nullable=False)

    tenant = relationship("Tenant", backref="assigned_users", lazy="selectin")
    user = relationship("User", backref="assigned_tenants", lazy="selectin")
    
    __table_args__ = (
        UniqueConstraint('tenant_id', 'user_id', name='_tenant_user_uc'),
    )