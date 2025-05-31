from .base import BaseRepository
from app.db.models import CompanyAccess

class CompanyAccessRepository(BaseRepository[CompanyAccess]):
    def __init__(self):
        super().__init__(CompanyAccess, relationships=["company", "plan"])
