import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
    EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL", "text-embedding-3-small")
    VECTORSTORE_PATH: str = os.getenv("VECTORSTORE_PATH", "data/vectorstore")
    QA_CACHE_PATH: str = os.getenv("QA_CACHE_PATH", "data/qa_cache")
    REDIS_HOST: str = os.getenv("REDIS_HOST")
    REDIS_PORT: int = int(os.getenv("REDIS_PORT"))
    REDIS_PASSWORD: str = os.getenv("REDIS_PASSWORD")
    REDIS_DB: int = int(os.getenv("REDIS_DB"))
    FASTAPI_TITLE: str = os.getenv("FASTAPI_TITLE", "Lexobot AI Assistant")
    TENANT_BASE_PATH = os.getenv("TENANT_BASE_PATH")

settings = Settings()