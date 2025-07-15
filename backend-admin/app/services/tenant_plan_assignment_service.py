from datetime import datetime
from app.utils import get_cr_today_date
from app.db.models import TenantPlanAssignment
from sqlalchemy.ext.asyncio import AsyncSession
from app.services.tenant_service import TenantService
from app.repositories import TenantPlanAssignmentRepository
from app.core import ValidationException, NotFoundException
from app.schemas import TenantPlanAssignmentCreate, TenantPlanAssignmentUpdate


class TenantPlanAssignmentService:
    def __init__(self):
        self.repository = TenantPlanAssignmentRepository()
        self.tenant_service = TenantService()

    async def _ensure_tenant_exists(self, db: AsyncSession, tenant_id: int):
        await self.tenant_service.get(db, tenant_id)

    async def _validate_assignment_belongs_to_tenant(
        self, db: AsyncSession, tenant_id: int, assignment_id: int
    ) -> TenantPlanAssignment:
        assignment = await self.repository.get_by_id(db, assignment_id)
        if not assignment:
            raise NotFoundException("Tenant plan assignment", assignment_id)

        if assignment.tenant_id != tenant_id:
            raise ValidationException("Assignment does not belong to tenant")

        return assignment

    async def list_by_tenant(self, db: AsyncSession, tenant_id: int) -> list[TenantPlanAssignment]:
        await self._ensure_tenant_exists(db, tenant_id)
        return await self.repository.get_all_by_tenant(db, tenant_id)

    async def get(self, db: AsyncSession, tenant_id: int, assignment_id: int) -> TenantPlanAssignment:
        await self._ensure_tenant_exists(db, tenant_id)
        return await self._validate_assignment_belongs_to_tenant(db, tenant_id, assignment_id)

    async def create(self, db: AsyncSession, tenant_id: int, obj_in: TenantPlanAssignmentCreate) -> TenantPlanAssignment:
        await self._ensure_tenant_exists(db, tenant_id)

        if not self.is_expiration_after_assignment(obj_in.assigned_at, obj_in.expires_at):
            raise ValidationException("Adquisición del plan debe ser posterior a la fecha de vencimiento.")

        today_cr = get_cr_today_date()

        expiration_date = obj_in.expires_at.date() if hasattr(obj_in.expires_at, "date") else obj_in.expires_at

        if expiration_date <= today_cr:
            raise ValidationException("La fecha de vencimiento del plan debe ser posterior a la fecha actual.")

        db_obj = {
            **obj_in.model_dump(),
            "tenant_id": tenant_id,
        }

        return await self.repository.create(db, db_obj)

    async def update(self, db: AsyncSession, tenant_id: int, assignment_id: int, obj_in: TenantPlanAssignmentUpdate) -> TenantPlanAssignment:
        await self._ensure_tenant_exists(db, tenant_id)
        await self._validate_assignment_belongs_to_tenant(db, tenant_id, assignment_id)

        if obj_in.expires_at and obj_in.plan_id is not None:
            existing = await self.repository.get_by_id(db, assignment_id)
            if not self.is_expiration_after_assignment(existing.assigned_at, obj_in.expires_at):
                raise ValidationException("Plan expiration date must be greater than assignment date")

        return await self.repository.update(db, assignment_id, obj_in.dict(exclude_unset=True))

    async def delete(self, db: AsyncSession, tenant_id: int, assignment_id: int) -> bool:
        await self._ensure_tenant_exists(db, tenant_id)
        await self._validate_assignment_belongs_to_tenant(db, tenant_id, assignment_id)

        return await self.repository.delete(db, assignment_id)

    @staticmethod
    def is_expiration_after_assignment(assigned_at: datetime, expires_at: datetime) -> bool:
        return expires_at > assigned_at
