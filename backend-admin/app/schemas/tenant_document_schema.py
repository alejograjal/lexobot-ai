from typing import List
from pydantic import BaseModel, Field

class TenantDocumentBase(BaseModel):
    tenant_id: int
    document_name: str = Field(..., max_length=255)
    file_path: str

class TenantDocumentCreate(TenantDocumentBase):
    pass

class TenantDocumentUpdate(BaseModel):
    document_name: str | None = Field(None, max_length=255)
    file_path: str | None = None
    
class TenantDocumentResponse(TenantDocumentBase):
    id: int
    is_active: bool