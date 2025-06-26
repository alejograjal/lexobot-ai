import asyncio
from fastapi import FastAPI
from app.core import settings
from app.api import api_router
from app.services import run_periodic_cleanup
from fastapi.middleware.cors import CORSMiddleware
from app.exceptions import register_exception_handlers

app = FastAPI(
    title=settings.FASTAPI_TITLE,
    description="Lexobot AI Assistant API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

register_exception_handlers(app) 

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

@app.on_event("startup")
async def start_background_tasks():
    asyncio.create_task(run_periodic_cleanup(interval_seconds=3600))