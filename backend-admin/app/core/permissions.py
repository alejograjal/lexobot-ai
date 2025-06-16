from fastapi import Depends
from .enums import UserRole
from .security import SecurityHandler
from fastapi.security import HTTPAuthorizationCredentials
from .exceptions import InsufficientPermissionsError, InvalidTokenError

class RoleChecker:
    def __init__(self, allowed_roles: list[UserRole]):
        self.allowed_roles = [role.value.lower() for role in allowed_roles]

    async def __call__(self, token: HTTPAuthorizationCredentials = Depends(SecurityHandler.security_scheme)):
        payload = SecurityHandler.verify_token(token.credentials)
        if not payload:
            raise InvalidTokenError()
        
        if payload["role"]["name"].lower()  not in self.allowed_roles:
            raise InsufficientPermissionsError(f"one of {', '.join(self.allowed_roles)}")
        return payload

require_administrator = RoleChecker([UserRole.ADMINISTRATOR])
require_company = RoleChecker([UserRole.COMPANY])
require_tenant = RoleChecker([UserRole.TENANT])
require_company_or_admin = RoleChecker([UserRole.COMPANY, UserRole.ADMINISTRATOR])
require_company_or_tenant = RoleChecker([UserRole.COMPANY, UserRole.TENANT])
require_any_role = RoleChecker([UserRole.ADMINISTRATOR, UserRole.COMPANY, UserRole.TENANT])