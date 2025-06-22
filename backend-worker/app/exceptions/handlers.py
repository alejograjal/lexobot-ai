from fastapi import Request
from fastapi.responses import JSONResponse
from app.core import (
    TenantNotFoundError,
    CompanyNotFoundError,
    InvalidHMACSignatureError,
    TokenExpiredError,
    DocumentNotFoundForVectorstoreError,
    TenantConfigNotFoundError,
    TenantDocumentNotFoundError
)

def register_exception_handlers(app):
    @app.exception_handler(TenantNotFoundError)
    async def tenant_not_found_handler(request: Request, exc: TenantNotFoundError):
        return JSONResponse(
            status_code=404,
            content={"detail": exc.message}
        )

    @app.exception_handler(CompanyNotFoundError)
    async def company_not_found_handler(request: Request, exc: CompanyNotFoundError):
        return JSONResponse(
            status_code=404,
            content={"detail": exc.message}
        )

    @app.exception_handler(InvalidHMACSignatureError)
    async def invalid_hmac_handler(request: Request, exc: InvalidHMACSignatureError):
        return JSONResponse(
            status_code=403,
            content={"detail": exc.message}
        )

    @app.exception_handler(TokenExpiredError)
    async def token_expired_handler(request: Request, exc: TokenExpiredError):
        return JSONResponse(
            status_code=403,
            content={"detail": exc.message}
        )

    @app.exception_handler(DocumentNotFoundForVectorstoreError)
    async def no_docs_handler(request: Request, exc: DocumentNotFoundForVectorstoreError):
        return JSONResponse(
            status_code=400,
            content={"detail": exc.message}
        )
    
    @app.exception_handler(TenantConfigNotFoundError)
    async def tenant_config_not_found_handler(request: Request, exc: TenantConfigNotFoundError):
        return JSONResponse(
            status_code=404,
            content={"detail": exc.message}
        )
    
    @app.exception_handler(Exception)
    async def unhandled_exception_handler(request: Request, exc: Exception):
        return JSONResponse(
            status_code=500,
            content={
                 "detail": "An unexpected error occurred. Please contact support if the issue persists."
            }
        )
    
    @app.exception_handler(TenantDocumentNotFoundError)
    async def tenant_document_not_found_handler(request: Request, exc: TenantDocumentNotFoundError):
        return JSONResponse(
            status_code=404,
            content={"detail": exc.message}
        )
