import calendar
from uuid import uuid4
from app.db.models import CompanyAccess
from app.core import ValidationException
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime, timedelta, timezone
from app.repositories import CompanyAccessRepository
from app.schemas import CompanyAccessCreate, CompanyAccessUpdate

class CompanyAccessService:
    def __init__(self, repository: CompanyAccessRepository):
        self.repository = repository

    async def create_access(self, db: AsyncSession, obj_in: CompanyAccessCreate) -> CompanyAccess:
        now = datetime.now(timezone.utc)
        
        year, month = obj_in.plan_acquisition_date.year, obj_in.plan_acquisition_date.month
        last_day = calendar.monthrange(year, month)[1]
        plan_expiration_date = obj_in.plan_acquisition_date.replace(day=last_day)

        if obj_in.plan_acquisition_date > plan_expiration_date:
            raise ValidationException("Plan acquisition date cannot be greater than plan expiration date.")

        db_obj = {
            **obj_in.model_dump(),
            "openai_api_key": str(uuid4()),
            "issue_at": now,
            "expires_at": now + timedelta(days=365 * 5),
            "plan_expiration_date": plan_expiration_date,
        }

        return await self.repository.create(db, db_obj)
    
    async def update_access(self, db: AsyncSession, access_id: int, obj_in: CompanyAccessUpdate) -> CompanyAccess:
        if obj_in.plan_expiration_date.day != calendar.monthrange(
            obj_in.plan_expiration_date.year, obj_in.plan_expiration_date.month
        )[1]:
            raise ValidationException("plan_expiration_date must be the last day of the month")

        return await self.repository.update(db, access_id, {"plan_expiration_date": obj_in.plan_expiration_date})

    async def delete_access(self, db: AsyncSession, access_id: int) -> bool:
        return await self.repository.delete(db, access_id)
