from fastapi import FastAPI
from app.core import settings
from app.api import api_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title=settings.FASTAPI_TITLE,
    description="Lexobot AI Assistant API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API router
app.include_router(api_router)

@app.get("/", tags=["Health"])
def root():
    """Health check endpoint"""
    return {
        "message": "Lexobot AI Assistant is running.",
        "version": "1.0.0",
        "status": "healthy"
    }
