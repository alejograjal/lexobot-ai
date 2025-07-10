import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    FASTAPI_TITLE: str = os.getenv("FASTAPI_TITLE", "Lexobot Administration Center")
    SECRET_KEY: str = os.getenv("SECRET_KEY")
    POSTGRESQL_SERVER: str = os.getenv("POSTGRESQL_SERVER")
    POSTGRESQL_USER: str = os.getenv("POSTGRESQL_USER")
    POSTGRESQL_PASSWORD: str = os.getenv("POSTGRESQL_PASSWORD")
    POSTGRESQL_PORT: str = os.getenv("POSTGRESQL_PORT", "5432")
    POSTGRESQL_DB: str = os.getenv("POSTGRESQL_DB")
    CORS_ORIGINS: list = os.getenv("CORS_ORIGINS", "*").split(",")
    TENANT_WORKER_API_URL: str = os.getenv("TENANT_WORKER_API_URL")
    BREVO_API_KEY: str = os.getenv("BREVO_API_KEY")
    AUTH_USER_LINK: str = os.getenv("AUTH_USER_LINK")

    @property
    def POSTGRESQL_DATABASE_URL(self):
        return f"postgresql+asyncpg://{self.POSTGRESQL_USER}:{self.POSTGRESQL_PASSWORD}@{self.POSTGRESQL_SERVER}:{self.POSTGRESQL_PORT}/{self.POSTGRESQL_DB}"

settings = Settings()