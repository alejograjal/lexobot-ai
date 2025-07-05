from typing import List
from pydantic import BaseModel, Field

class TenantDocumentBase(BaseModel):
    tenant_id: int
    document_name: str = Field(..., max_length=255)
    file_path: str

class TenantDocumentCount(BaseModel):
    count: int

class TenantDocumentCreate(BaseModel):
    document_name: str = Field(..., max_length=255)
    
class TenantDocumentResponse(TenantDocumentBase):
    id: int
    is_active: bool