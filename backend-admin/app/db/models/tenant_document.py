from .base import BaseModel
from sqlalchemy.orm import relationship
from sqlalchemy import Column, Integer, String, ForeignKey, Text

class TenantDocument(BaseModel):
    __tablename__ = 'tenant_documents'
    tenant_id = Column(Integer, ForeignKey('tenants.id'), nullable=False)
    document_name = Column(String(255), nullable=False)
    file_path = Column(Text, nullable=False)

    tenant = relationship("Tenant", backref="documents")