from typing import List
from app.db.models import Plan
from app.repositories import PlanRepository
from app.schemas import PlanCreate, PlanUpdate
from sqlalchemy.ext.asyncio import AsyncSession
from app.core import NotFoundException, ValidationException

class PlanService:
    def __init__(self):
        self.repository = PlanRepository()

    async def create_plan(self, db: AsyncSession, data: PlanCreate) -> Plan:
        existing = await self.repository.get_by_name_and_category(db, data.name, data.plan_category_id)
        if existing:
            raise ValidationException(f"Plan '{data.name}' already exists in this category")
        
        plan = await self.repository.create(db, data.dict())
    
        return await self.repository.get_by_id(db, plan.id)

    async def get_plan(self, db: AsyncSession, plan_id: int, include_inactive: bool = False) -> Plan:
        plan = await self.repository.get_by_id(db, plan_id, include_inactive)
        if not plan:
            raise NotFoundException("Plan", plan_id)
        
        return plan

    async def get_all_plans(self, db: AsyncSession, include_inactive: bool = False) -> List[Plan]:
        return await self.repository.get_all(db, include_inactive)

    async def update_plan(self, db: AsyncSession, plan_id: int, data: PlanUpdate) -> Plan:
        plan = await self.repository.get_by_id(db, plan_id)
        if not plan:
            raise NotFoundException("Plan", plan_id)

        new_name = data.name if data.name is not None else plan.name
        new_category_id = data.plan_category_id if data.plan_category_id is not None else plan.plan_category_id

        if (new_name != plan.name) or (new_category_id != plan.plan_category_id):
            existing = await self.repository.get_by_name_and_category(db, new_name, new_category_id)
            if existing and existing.id != plan_id:
                raise ValidationException(f"Plan '{new_name}' already exists in this category")

        return await self.repository.update(db, plan_id, data.dict(exclude_unset=True))

    async def delete_plan(self, db: AsyncSession, plan_id: int) -> bool:
        if not await self.repository.exists(db, plan_id):
            raise NotFoundException("Plan", plan_id)
        
        if await self.repository.has_active_company_access(db, plan_id):
            raise ValidationException("Cannot delete plan with active company access assigned")
        
        return await self.repository.delete(db, plan_id)
