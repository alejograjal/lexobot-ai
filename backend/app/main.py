from fastapi import FastAPI
from app.api.routes import router
from app.core.config import settings

app = FastAPI(title=settings.FASTAPI_TITLE)

app.include_router(router)

@app.get("/")
def root():
    return {"message": "Assistant is running."}
