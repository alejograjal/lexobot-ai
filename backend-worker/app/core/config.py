import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    REDIS_HOST: str = os.getenv("REDIS_HOST")
    REDIS_PORT: int = int(os.getenv("REDIS_PORT"))
    REDIS_DB: int = int(os.getenv("REDIS_DB"))
    REDIS_PASSWORD: str = os.getenv("REDIS_PASSWORD")
    FASTAPI_TITLE: str = os.getenv("FASTAPI_TITLE", "Lexobot AI Assistant")
    TENANT_BASE_PATH = os.getenv("TENANT_BASE_PATH")
    CORS_ORIGINS: list = os.getenv("CORS_ORIGINS", "*").split(",")
    SECRETS_PATH: str = os.getenv("SECRETS_PATH")

settings = Settings()