from typing import List
from app.db.models import PlanCategory
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories import PlanCategoryRepository
from app.core import NotFoundException, ValidationException
from app.schemas import PlanCategoryCreate, PlanCategoryUpdate

class PlanCategoryService:
    def __init__(self):
        self.repository = PlanCategoryRepository()

    async def create(self, db: AsyncSession, obj_in: PlanCategoryCreate) -> PlanCategory:
        return await self.repository.create(db, obj_in.model_dump())

    async def update(self, db: AsyncSession, plan_category_id: int, obj_in: PlanCategoryUpdate) -> PlanCategory:
        if not await self.repository.exists(db, plan_category_id):
            raise NotFoundException(f"Plan Category", plan_category_id)
        
        return await self.repository.update(db, plan_category_id, obj_in.model_dump(exclude_unset=True))

    async def get_by_id(self, db: AsyncSession, id: int) -> PlanCategory:
        category = await self.repository.get_by_id(db, id)
        if not category:
            raise NotFoundException("PlanCategory", id)
        return category

    async def get_all(self, db: AsyncSession) -> List[PlanCategory]:
        return await self.repository.get_all(db)

    async def delete(self, db: AsyncSession, id: int) -> bool:
        category = await self.repository.get_by_id(db, id)
        if not category:
            raise NotFoundException("PlanCategory", id)

        has_active_plans = any(plan.is_active for plan in category.plans)
        if has_active_plans:
            raise ValidationException("Cannot delete category with active plans")

        return await self.repository.delete(db, id)
