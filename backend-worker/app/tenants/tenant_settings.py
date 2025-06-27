import os
import json
import aiofiles
import redis.asyncio as redis
from app.core import settings, TenantConfigNotFoundError

redis_client = redis.Redis(
    host=settings.REDIS_HOST,
    port=settings.REDIS_PORT,
    db=settings.REDIS_DB,
    password=settings.REDIS_PASSWORD,
    decode_responses=True
)

def get_tenant_path(tenant_id: str) -> str:
    return os.path.join(settings.TENANT_BASE_PATH, tenant_id)

async def load_tenant_settings(tenant_id: str) -> dict:
    cache_key = f"tenant_settings:{tenant_id}"
    cached = await redis_client.get(cache_key)
    if cached:
        return json.loads(cached)

    tenant_path = os.path.join(settings.TENANT_BASE_PATH, tenant_id)
    settings_path = os.path.join(tenant_path, "settings.json")

    if not os.path.exists(settings_path):
        raise TenantConfigNotFoundError(tenant_id)

    async with aiofiles.open(settings_path, "r") as f:
        content = await f.read()
        data = json.loads(content)

    await redis_client.set(cache_key, json.dumps(data), ex=300) 
    return data