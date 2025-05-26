from fastapi import FastAPI
from app.api import api_router
from fastapi.exceptions import HTTPException
from fastapi.middleware.cors import CORSMiddleware
from starlette.authentication import AuthenticationError
from app.core import (
    settings,
    app_exception_handler,
    general_exception_handler,
    authentication_handler,
    AppException,
    AuditMiddleware
)

def create_app() -> FastAPI:
    """Create and configure FastAPI application."""
    app = FastAPI(
        title=settings.FASTAPI_TITLE,
        description="Lexobot Administration Center API",
        version="1.0.0",
        docs_url="/docs",
        redoc_url="/redoc",
        openapi_url="/openapi.json"
    )

    # Configure exception handlers
    app.add_exception_handler(AppException, app_exception_handler)
    app.add_exception_handler(Exception, general_exception_handler)
    app.add_exception_handler(HTTPException, authentication_handler)
    app.add_exception_handler(AuthenticationError, authentication_handler)

    # Add middlewares
    app.add_middleware(AuditMiddleware)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(api_router, prefix="/api")

    return app

app = create_app()

@app.get("/")
def root():
    """Root endpoint for API health check."""
    return {
        "message": "Lexobot Administration Center API is running.",
        "version": "1.0.0",
        "status": "healthy"
    }
