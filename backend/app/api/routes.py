from pydantic import BaseModel
from fastapi import APIRouter, HTTPException
from app.services.qa.engine import ask_question as qa_engine_ask_question 

router = APIRouter()

class QuestionRequest(BaseModel):
    question: str

@router.post("/ask")
def ask_question(payload: QuestionRequest):
    try:
        answer = qa_engine_ask_question(payload.question)
        return {"answer": answer}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))