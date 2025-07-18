from datetime import datetime
from pydantic import BaseModel, Field

class TenantDocumentBase(BaseModel):
    tenant_id: int
    effective_date: datetime
    document_name: str = Field(..., max_length=255)
    file_path: str

class TenantDocumentCount(BaseModel):
    count: int

class TenantDocumentCreate(BaseModel):
    effective_date: datetime
    document_name: str = Field(..., max_length=255)
    
class TenantDocumentResponse(TenantDocumentBase):
    id: int
    is_active: bool