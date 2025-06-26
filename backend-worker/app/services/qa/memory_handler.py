from app.core import settings
from redis.asyncio import Redis
from langchain.memory import ConversationBufferMemory
from langchain_community.chat_message_histories import RedisChatMessageHistory

MEMORY_TTL_SECONDS = 60 * 60 * 2 

redis_client = Redis(
    host=settings.REDIS_HOST,
    port=settings.REDIS_PORT,
    db=settings.REDIS_DB,
    password=settings.REDIS_PASSWORD,
    decode_responses=True
)

async def get_memory(tenant_id: str, session_id: str) -> ConversationBufferMemory:
    key = f"memory:{tenant_id}:{session_id}"

    redis_url = f"redis://:{settings.REDIS_PASSWORD}@{settings.REDIS_HOST}:{settings.REDIS_PORT}/{settings.REDIS_DB}"

    history = RedisChatMessageHistory(
        session_id=key,
        url=redis_url,
        ttl=MEMORY_TTL_SECONDS
    )

    memory = ConversationBufferMemory(
        memory_key="chat_history",
        chat_memory=history,
        return_messages=True
    )

    return memory
