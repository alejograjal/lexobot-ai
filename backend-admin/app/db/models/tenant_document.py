from .base import BaseModel
from sqlalchemy.orm import relationship
from sqlalchemy import Column, Integer, String, ForeignKey, Text, DateTime, func

class TenantDocument(BaseModel):
    __tablename__ = 'tenant_documents'
    tenant_id = Column(Integer, ForeignKey('tenants.id'), nullable=False)
    effective_date = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    document_name = Column(String(255), nullable=False)
    file_path = Column(Text, nullable=False)

    tenant = relationship("Tenant", backref="documents", lazy="selectin")