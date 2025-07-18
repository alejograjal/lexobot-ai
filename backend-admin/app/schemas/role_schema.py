from typing import Optional
from pydantic import BaseModel

class RoleBase(BaseModel):
    name: str
    description: str = None

class RoleCreate(RoleBase):
    pass

class RoleUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None

class RoleResponse(RoleBase):
    id: int
    is_active: bool

class RoleResponseProfile(RoleBase):
    id: int
