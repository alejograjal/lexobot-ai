from fastapi import FastAPI
from app.api.routes import router

app = FastAPI(title="Lexobot AI")

app.include_router(router)

@app.get("/")
def root():
    return {"message": "Lexobot AI is running."}
