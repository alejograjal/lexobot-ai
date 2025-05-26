from enum import Enum

class UserRole(Enum):
    ADMINISTRATOR = "administrator"
    COMPANY = "company"
    TENANT = "tenant"