import json
import redis
from app.core.config import settings
from app.services.embedder import embedding_model

redis_client = redis.Redis(host=settings.REDIS_HOST, port=settings.REDIS_PORT, db=settings.REDIS_DB)

EMBEDDING_TTL_SECONDS = 60 * 60 * 24 * 7

def normalize_question(question: str) -> str:
    import re
    question = question.lower().strip()
    question = re.sub(r'[^\w\sáéíóúñ]', '', question) 
    question = re.sub(r'\s+', ' ', question) 
    return question

def get_cache_key(question: str) -> str:
    return f"embedding:{normalize_question(question)}" 

def get_or_embed(question: str) -> list[float]:
    key = get_cache_key(question)
    cached = redis_client.get(key)

    if cached:
        return json.loads(cached)

    embedding = embedding_model.embed_query(question)

    redis_client.setex(key, EMBEDDING_TTL_SECONDS, json.dumps(embedding))

    return embedding
