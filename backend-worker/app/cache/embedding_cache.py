import json
import redis.asyncio as redis
from app.core import settings
from app.services.embedder import get_embedding_model

redis_client = redis.Redis(host=settings.REDIS_HOST, port=settings.REDIS_PORT, db=settings.REDIS_DB, password=settings.REDIS_PASSWORD)

EMBEDDING_TTL_SECONDS = 60 * 60 * 24 * 7

def normalize_question(question: str) -> str:
    import re
    question = question.lower().strip()
    question = re.sub(r'[^\w\sáéíóúñ]', '', question) 
    question = re.sub(r'\s+', ' ', question) 
    return question

def get_cache_key(tenant_id: str, question: str) -> str:
    norm = normalize_question(question)
    return f"{tenant_id}:embedding:{norm}"

async def get_or_embed(tenant_id: str, question: str) -> list[float]:
    key = get_cache_key(tenant_id, question)
    cached = await redis_client.get(key)

    if cached:
        return json.loads(cached)

    embedding_model = await get_embedding_model(tenant_id)
    embedding = embedding_model.embed_query(question)
    await redis_client.setex(key, EMBEDDING_TTL_SECONDS, json.dumps(embedding))

    return embedding