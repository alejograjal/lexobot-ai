import logging
from fastapi import Request, status
from .exceptions import AppException
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.authentication import AuthenticationError
from starlette.status import HTTP_422_UNPROCESSABLE_ENTITY
from app.schemas import ValidationErrorDetail, ErrorObject, ErrorResponse 

logger = logging.getLogger(__name__)

async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    """
    Handles validation errors from FastAPI and formats them like the other application errors.
    """
    details = [ValidationErrorDetail(**error) for error in exc.errors()]

    error_response = ErrorResponse(
        error=ErrorObject(
            code="VALIDATION_ERROR",
            message="Validation failed",
            status=HTTP_422_UNPROCESSABLE_ENTITY,
            path=request.url.path,
            details=details
        )
    )

    logger.warning(
        "Validation error",
        extra={
            "errors": exc.errors(),
            "request_method": request.method,
            "request_url": str(request.url),
            "client_host": request.client.host
        }
    )

    return JSONResponse(
        status_code=HTTP_422_UNPROCESSABLE_ENTITY,
        content=error_response.dict()
    )

async def app_exception_handler(request: Request, exc: AppException) -> JSONResponse:
    """
    Handles all AppExceptions and converts them to a consistent error response format
    """
    error_response = {
        "error": {
            "code": exc.error_code,
            "message": exc.detail,
            "status": exc.status_code,
            "path": request.url.path
        }
    }

    logger.error(
        f"Application error: {exc.error_code}",
        extra={
            "error_details": error_response,
            "request_method": request.method,
            "request_url": str(request.url),
            "client_host": request.client.host
        }
    )

    return JSONResponse(
        status_code=exc.status_code,
        content=error_response
    )

async def general_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    print('encountered exception')
    """
    Handles any unhandled exceptions and converts them to a 500 error response
    """
    error_response = {
        "error": {
            "code": "INTERNAL_SERVER_ERROR",
            "message": "An unexpected error occurred",
            "status": status.HTTP_500_INTERNAL_SERVER_ERROR,
            "path": request.url.path
        }
    }

    logger.exception(
        "Unhandled exception occurred",
        extra={
            "request_method": request.method,
            "request_url": str(request.url),
            "client_host": request.client.host
        }
    )

    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content=error_response,
        headers={"Content-Type": "application/json"}
    )

async def authentication_handler(request: Request, exc: AuthenticationError) -> JSONResponse:
    """
    Handles authentication errors and formats them according to our standard
    """
    error_response = {
        "error": {
            "code": "NOT_AUTHENTICATED",
            "message": "Authentication required",
            "status": status.HTTP_401_UNAUTHORIZED,
            "path": request.url.path
        }
    }

    logger.error(
        "Authentication error",
        extra={
            "error_details": error_response,
            "request_method": request.method,
            "request_url": str(request.url),
            "client_host": request.client.host
        }
    )

    return JSONResponse(
        status_code=status.HTTP_401_UNAUTHORIZED,
        content=error_response,
        headers={"WWW-Authenticate": "Bearer"}
    )