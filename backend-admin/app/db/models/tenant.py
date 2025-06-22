import uuid
from .base import BaseModel
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import (Column, Integer, String)

class Tenant(BaseModel):
    __tablename__ = 'tenants'
    external_id = Column(UUID(as_uuid=True), unique=True, nullable=False, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    contact_name = Column(String(255), nullable=False)
    contact_email = Column(String(255), nullable=False)
    client_count = Column(Integer, default=0, nullable=False)
    server_ip = Column(String(15), nullable=True)