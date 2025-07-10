from enum import Enum
from enum import Enum as PyEnum

class UserRole(Enum):
    ADMINISTRATOR = "administrator"
    COMPANY = "company"
    TENANT = "tenant"

class TokenPurpose(str, PyEnum):
    CONFIRM_ACCOUNT = "confirm_account"
    RESET_PASSWORD = "reset_password"

purpose_labels = {
    TokenPurpose.CONFIRM_ACCOUNT: "confirmación de cuenta",
    TokenPurpose.RESET_PASSWORD: "recuperación de contraseña",
}