import asyncio
from fastapi import FastAPI
from app.api import api_router
from fastapi import HTTPException
from redis.exceptions import RedisError
from app.core import settings, redis_client
from app.services import run_periodic_cleanup
from fastapi.middleware.cors import CORSMiddleware
from app.exceptions import register_exception_handlers
from app.services.billing import run_token_usage_cleanup

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

app.include_router(api_router)

@app.get("/health", tags=["Health"])
async def health_check():
    try:
        pong = await redis_client.ping()
        if not pong:
            raise RedisError("No PONG from Redis")
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Redis unhealthy: {str(e)}")

    return {
        "message": "Lexobot AI Assistant is running.",
        "version": "1.0.0",
        "status": "healthy",
        "redis": "healthy"
    }

@app.on_event("startup")
async def start_background_tasks():
    asyncio.create_task(run_periodic_cleanup(interval_seconds=3600))
    asyncio.create_task(run_token_usage_cleanup(interval_seconds=86400))