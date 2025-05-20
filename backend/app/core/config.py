import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
    PDF_FOLDER_PATH = os.getenv("PDF_FOLDER_PATH", "docs")
    EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL", "text-embedding-3-small")
    VECTORSTORE_PATH: str = os.getenv("VECTORSTORE_PATH", "data/vectorstore")
    QA_CACHE_PATH: str = os.getenv("QA_CACHE_PATH", "data/qa_cache")
    REDIS_HOST: str = os.getenv("REDIS_HOST")
    REDIS_PORT: int = int(os.getenv("REDIS_PORT"))
    REDIS_DB: int = int(os.getenv("REDIS_DB"))
    FASTAPI_TITLE: str = os.getenv("FASTAPI_TITLE", "Lexobot AI Assistant")

settings = Settings()