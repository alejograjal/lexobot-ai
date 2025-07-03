from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories import CompanyUserRepository
from .tenant_user_service import TenantUserService
from app.services import CompanyService, UserService
from app.db.models import CompanyUser, Company, Tenant
from app.core import NotFoundException, get_current_id
from app.schemas import CompanyUserCreate, CompanyUserUpdate, CompanyUserBulkSync

class CompanyUserService:
    def __init__(self):
        self.repository = CompanyUserRepository()
        self.company_service = CompanyService()
        self.user_service = UserService()
        self.tenant_user_service = TenantUserService()

    async def get_all_by_company(self, db: AsyncSession, company_id: int) -> List[CompanyUser]:
        return await self.repository.get_all_by_company(db, company_id)
    
    async def get_all_by_user(self, db: AsyncSession, user_id: int) -> List[CompanyUser]:
        return await self.repository.get_all_by_user(db, user_id)
    
    async def get_all_company_by_current_user(self, db: AsyncSession) -> List[Company]:
        allowed_companies = await self.get_all_by_user(db, get_current_id())
        return [company.company for company in allowed_companies]
    
    async def get_tenants_assigned_to_company_by_current_user(self, db: AsyncSession) -> List[Tenant]:
        companies_assigned = await self.get_all_company_by_current_user(db)
        company_ids = [company.id for company in companies_assigned]
        
        company_tenants_assigned = await self.tenant_user_service.company_tenant_assignment_service.get_tenant_by_companies_ids(db, company_ids)
        return [company_tenant.tenant for company_tenant in company_tenants_assigned]
    
    async def get_company_user(self, db: AsyncSession, company_user_id: int) -> CompanyUser:
        company_user = await self.repository.get_by_id(db, company_user_id)
        if not company_user:
            raise NotFoundException("Company user", company_user_id)
        
        return company_user
    
    async def create(self, db: AsyncSession, company_id: int, dto: CompanyUserCreate):
        async with db.begin():
            await self.company_service.get_company(db, company_id)
            
            user_created = await self.user_service.create_user(db, dto.user)

            company_user = {
                "company_id": company_id,
                "user_id": user_created.id,
                "assign": dto.assign
            }
            
            result = await self.repository.create(db, company_user)
            return result
        
    async def update(self, db: AsyncSession, company_id: int, company_user_id: int, dto: CompanyUserUpdate):
        async with db.begin():    
            company_user = await self.repository.get_by_id(db, company_user_id)

            if not company_user:
                raise NotFoundException("Company user", company_user_id)
            
            if company_user.company_id != company_id:
                raise NotFoundException("Company user", company_user_id)
            
            user_updated = await self.user_service.update_user(db, company_user.user.id, dto.user)

            company_user = {
                "company_id": company_id,
                "user_id": user_updated.id,
                "assign": dto.assign
            }

            result = await self.repository.update(db, company_user_id, company_user)
            return result
    
    async def delete(self, db: AsyncSession, company_id: int, company_user_id: int):
        async with db.begin():
            if not await self.repository.exists(db, company_user_id):
                raise NotFoundException("Company user", company_user_id)
            
            company_user = await self.repository.get_by_id(db, company_user_id)
            
            if company_user.company_id != company_id:
                raise NotFoundException("Company user", company_user_id)

            await self.repository.delete(db, company_user_id)
            await self.user_service.delete_user(db, company_user.user_id)
        
        return True
    
    async def bulk_sync(self, db: AsyncSession, company_id: int, dto: CompanyUserBulkSync):
        async with db.begin():
            await self.company_service.get_company(db, company_id)

            existing_assignments = await self.repository.get_all_by_company(db, company_id)
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