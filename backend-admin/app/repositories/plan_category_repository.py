from .base import BaseRepository
from app.db.models import PlanCategory

class PlanCategoryRepository(BaseRepository[PlanCategory]):
    def __init__(self):
        super().__init__(PlanCategory, relationships=["plans"])