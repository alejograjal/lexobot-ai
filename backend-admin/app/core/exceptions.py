from fastapi import HTTPException, status

class AppException(HTTPException):
    """Base exception for all application exceptions"""
    def __init__(self, detail: str, status_code: int = status.HTTP_400_BAD_REQUEST, error_code: str = None):
        super().__init__(status_code=status_code, detail=detail)
        self.error_code = error_code or "APP_ERROR"

class NotFoundException(AppException):
    """Resource not found"""
    def __init__(self, resource: str, resource_id: int):
        super().__init__(
            detail=f"{resource} with id {resource_id} not found",
            status_code=status.HTTP_404_NOT_FOUND
        )

class DuplicateEntryError(AppException):
    """Duplicate entry error"""
    def __init__(self, resource: str, field: str):
        super().__init__(
            detail=f"{resource} with this {field} already exists",
            status_code=status.HTTP_400_BAD_REQUEST
        )

class AppAuthException(AppException):
    """Base class for authentication errors"""
    def __init__(self, detail: str):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            error_code="AUTHENTICATION_ERROR",
            detail=detail
        )

class InvalidCredentialsError(AppAuthException):
    def __init__(self):
        super().__init__(detail="Invalid username or password")

class ForbiddenError(AppException):
    """Base class for forbidden access errors"""
    def __init__(self, detail: str, error_code: str = "FORBIDDEN"):
        super().__init__(
            status_code=status.HTTP_403_FORBIDDEN,
            error_code=error_code,
            detail=detail
        )

class AccountLockedError(AppException):
    def __init__(self, minutes: int):
        super().__init__(
            status_code=status.HTTP_403_FORBIDDEN,
            error_code="ACCOUNT_LOCKED",
            detail=f"Account locked. Try again in {minutes} minutes"
        )

class InsufficientPermissionsError(ForbiddenError):
    def __init__(self, required_role: str):
        super().__init__(
            detail=f"Operation requires {required_role} role",
            error_code="INSUFFICIENT_PERMISSIONS"
        )

class ValidationException(AppException):
    """Base class for validation errors"""
    def __init__(self, detail: str):
        super().__init__(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            error_code="VALIDATION_ERROR",
            detail=detail
        )

class InvalidTokenError(AppException):
    """Raised when token is invalid or expired"""
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            error_code="INVALID_TOKEN",
            detail="Token is invalid or has expired"
        )

class TenantUploadError(AppException):
    def __init__(self, tenant_id: int):
        super().__init__(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=f"Se ha presentado un problema al momento de cargar el documento para el tenant {tenant_id}"
        )

class UploadToTenantWorkerError(AppException):
    def __init__(self, action: str, tenant_id: int, detail: str):
        self.message = f"Failed to {action} for tenant {tenant_id}: {detail}"
        super().__init__(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=self.message)