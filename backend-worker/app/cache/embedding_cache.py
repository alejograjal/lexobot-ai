import json
import asyncio
from app.core import settings, redis_client
from app.services.embedder import get_embedding_model

EMBEDDING_TTL_SECONDS = 60 * 60 * 24 * 7

embedding_semaphore = asyncio.Semaphore(settings.MAX_EMBEDDING_PROCESSES)

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
    async with embedding_semaphore:
        normalized_question = normalize_question(question)
        key = get_cache_key(tenant_id, question)
        cached = await redis_client.get(key)

        if cached:
            return json.loads(cached)

        embedding_model = await get_embedding_model(tenant_id)

        try:
            embedding = await asyncio.to_thread(embedding_model.embed_query, normalized_question)
        except Exception:
            raise RuntimeError("Error al calcular el embedding de la pregunta")
        
        await redis_client.setex(key, EMBEDDING_TTL_SECONDS, json.dumps(embedding))

        return embedding