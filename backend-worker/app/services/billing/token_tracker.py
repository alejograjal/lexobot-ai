import asyncio
import tiktoken
import redis.asyncio as redis
from app.core import settings
from app.core import TokenLimitError
from datetime import datetime, timedelta
from app.tenants import load_tenant_settings

redis_client = redis.Redis(
    host=settings.REDIS_HOST,
    port=settings.REDIS_PORT,
    db=settings.REDIS_DB,
    password=settings.REDIS_PASSWORD,
    decode_responses=True
)

def get_token_encoder(model_name: str):
    try:
        return tiktoken.encoding_for_model(model_name)
    except KeyError:
        return tiktoken.get_encoding("cl100k_base")

def count_tokens(model: str, text: str) -> int:
    encoder = get_token_encoder(model)
    return len(encoder.encode(text))

def get_current_token_key(tenant_id: str, billing_start_day: int) -> str:
    now = datetime.now()

    if now.day < billing_start_day:
        year = now.year if now.month > 1 else now.year - 1
        month = now.month - 1 if now.month > 1 else 12
    else:
        year = now.year
        month = now.month

    return f"usage:{tenant_id}:{year}-{month:02d}"

async def check_token_availability(tenant_id: str, docs: list, question: str):
    conf = await load_tenant_settings(tenant_id)
    billing_day = conf.get("billing_start_day")
    limit = conf.get("token_limit")
    model = conf.get("chat_model")

    if limit is None:
        return

    key = get_current_token_key(tenant_id, billing_day)
    current = int(await redis_client.get(key) or 0)

    docs_text = "\n".join(doc.page_content for doc in docs)
    estimated = count_tokens(model, docs_text) + count_tokens(model, question)

    if current + estimated > limit:
        raise TokenLimitError(
            external_id=tenant_id,
            message="Límite mensual de tokens alcanzado"
        )

async def track_tokens(tenant_id: str, docs: list, question: str, response: str):
    conf = await load_tenant_settings(tenant_id)
    billing_day = conf.get("billing_start_day")
    model = conf.get("chat_model", "gpt-3.5-turbo")
    key = get_current_token_key(tenant_id, billing_day)

    docs_text = "\n".join(doc.page_content for doc in docs)
    total_tokens = (
        count_tokens(model, docs_text)
        + count_tokens(model, question)
        + count_tokens(model, response)
    )

    await redis_client.incrby(key, total_tokens)
    await redis_client.expire(key, 60 * 60 * 24 * 45)

async def get_token_usage_info(tenant_id: str) -> dict:
    conf = await load_tenant_settings(tenant_id)
    billing_day = conf.get("billing_start_day")
    limit = conf.get("token_limit")
    key = get_current_token_key(tenant_id, billing_day)
    used = int(await redis_client.get(key) or 0)
    return {
        "used": used,
        "limit": limit,
        "remaining": limit - used
    }

async def clean_old_token_usage_keys():
    months_to_keep = 2

    now = datetime.now()
    cutoff = now - timedelta(days=months_to_keep * 30) 

    keys = await redis_client.keys("usage:*")

    for key in keys:
        try:
            _, tenant_id, year_month = key.split(":")
            year, month = map(int, year_month.split("-"))
            key_date = datetime(year, month, 1)
            if key_date < cutoff:
                await redis_client.delete(key)
        except Exception:
            continue

async def run_token_usage_cleanup(interval_seconds: int = 86400):
    while True:
        await clean_old_token_usage_keys()
        await asyncio.sleep(interval_seconds)