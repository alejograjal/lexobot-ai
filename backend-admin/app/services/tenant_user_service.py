from typing import List
from .tenant_service import TenantService
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories import TenantUserRepository
from app.db.models import TenantUser, Company, Tenant
from app.core import NotFoundException, get_current_id
from app.schemas import TenantUserCreate, TenantUserUpdate, TenantUserBulkSync
from app.services import UserService, CompanyTenantAssignmentService, CompanyService

class TenantUserService:
    def __init__(self):
        self.repository = TenantUserRepository()
        self.tenant_service = TenantService()
        self.user_service = UserService()
        self.company_tenant_assignment_service = CompanyTenantAssignmentService()
        self.company_service = CompanyService()

    async def get_all_by_tenant(self, db: AsyncSession, tenant_id: int) -> List[TenantUser]:
        return await self.repository.get_all_by_tenant(db, tenant_id)
    
    async def get_all_by_user(self, db: AsyncSession, user_id: int) -> List[TenantUser]:
        return await self.repository.get_all_by_user(db, user_id)
    
    async def get_all_companies_by_user_per_tenant(self, db: AsyncSession) -> List[Company]:
        tenants_allowed = await self.get_all_by_user(db, get_current_id())
        tenant_ids = [tenant.tenant_id for tenant in tenants_allowed]
        companies_tenants = await self.company_tenant_assignment_service.get_all_by_tenants_ids(db, tenant_ids)
        companies = {company.company for company in companies_tenants}

        return companies
    
    async def get_all_tenants_by_user_per_company(self, db: AsyncSession) -> List[Tenant]:
        tenant_users_allowed = await self.get_all_by_user(db, get_current_id())

        assigned_tenants_to_company = []
        for tenant_user in tenant_users_allowed:
            tenants = await self.company_tenant_assignment_service.get_all_by_tenant(db, tenant_user.tenant_id)
            if tenants:
                assigned_tenants_to_company.append(tenant_user.tenant)

        return assigned_tenants_to_company
    
    async def get_tenant_user(self, db: AsyncSession, tenant_id: int, tenant_user_id: int) -> TenantUser:
        tenant_user = await self.repository.get_by_id(db, tenant_user_id)
        if not tenant_user or tenant_user.tenant_id != tenant_id:
            raise NotFoundException("Tenant user", tenant_user_id)
        
        return tenant_user
    
    async def get_tenant_users_available_to_assign(self, db: AsyncSession, tenant_id: int) -> List[TenantUser]:
        await self.tenant_service.get(db, tenant_id)

        company_id = await self.company_tenant_assignment_service.get_company_id_by_tenant_id(db, tenant_id)
        assigned_tenants = await self.company_tenant_assignment_service.get_all_by_company(db, company_id)
        available_tenant_ids = [t.tenant_id for t in assigned_tenants if t.tenant_id != tenant_id]

        already_tenant_users_assigned = await self.get_all_by_tenant(db, tenant_id)
        already_assigned_user_ids = {user.user_id for user in already_tenant_users_assigned}

        unique_users = {}
        for tid in available_tenant_ids:
            tenant_users = await self.get_all_by_tenant(db, tid)
            for user in tenant_users:
                if user.user_id not in already_assigned_user_ids:
                    unique_users[user.id] = user

        return list(unique_users.values())
    
    
    async def create(self, db: AsyncSession, tenant_id: int, dto: TenantUserCreate):
        async with db.begin():
            await self.tenant_service.get(db, tenant_id)

            user_created = await self.user_service.create_user(db, dto.user)

            tenant_user = {
                "tenant_id": tenant_id,
                "user_id": user_created.id,
                "assign": dto.assign
            }

            result = await self.repository.create(db, tenant_user)
            return result
        
    async def create_bulk(self, db: AsyncSession, tenant_id: int, dto: List[TenantUserBulkSync]):
        async with db.begin():
            await self.tenant_service.get(db, tenant_id)
            
            tenant_users = []
            for tenant_user_id in dto.user_ids:
                existing_tenant_users = await self.repository.get_by_id(db, tenant_user_id)
                tenant_user = {
                    "tenant_id": tenant_id,
                    "user_id": existing_tenant_users.user_id,
                    "assign": dto.assign
                }
                tenant_users.append(tenant_user)
                
            await self.repository.bulk_create(db, tenant_users)
            return await self.repository.get_all_by_tenant(db, tenant_id)

    async def update(self, db: AsyncSession, tenant_id: int, tenant_user_id: int, dto: TenantUserUpdate):
        async with db.begin():
            tenant_user = await self.repository.get_by_id(db, tenant_user_id)

            if not tenant_user:
                raise NotFoundException("Tenant user", tenant_user_id)
            
            if tenant_user.tenant_id != tenant_id:
                raise NotFoundException("Tenant user", tenant_user_id)

            user_updated = await self.user_service.update_user(db, tenant_user.user.id, dto.user)

            tenant_user = {
                "tenant_id": tenant_id,
                "user_id": user_updated.id,
                "assign": dto.assign
            }

            result = await self.repository.update(db, tenant_user_id, tenant_user)
            return result
    
    async def delete(self, db: AsyncSession, tenant_id: int ,tenant_user_id: int):
        async with db.begin():
            if not await self.repository.exists(db, tenant_user_id):
                raise NotFoundException("Tenant user", tenant_user_id)
            
            tenant_user = await self.repository.get_by_id(db, tenant_user_id)
            
            if tenant_user.tenant_id != tenant_id:
                raise NotFoundException("Tenant user", tenant_user_id)

            await self.repository.delete(db, tenant_user_id)
            await self.user_service.delete_user(db, tenant_user.user_id)

        return True
    
    async def bulk_sync(self, db: AsyncSession, tenant_id: int, dto: TenantUserBulkSync):
        async with db.begin():
            await self.tenant_service.get(db, tenant_id)
            
            existing_assignments = await self.repository.get_all_by_tenant(db, tenant_id)
            existing_user_map = {a.id: a for a in existing_assignments}

            updated_assignments = []

            for assignment in existing_assignments:
                if assignment.assign: 
                    assignment.assign = False
                    updated_assignments.append(assignment)

            for id in dto.user_ids:
                if id in existing_user_map:
                    assignment = existing_user_map[id]
                    assignment.assign = True
                    updated_assignments.append(assignment)

            return updated_assignments