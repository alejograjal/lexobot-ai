from pydantic import BaseModel
from app.tenants import validate_tenant_exists
from app.services import ask_question as qa_engine_ask_question 
from fastapi import APIRouter, HTTPException, Depends, Body, Query

router = APIRouter()

class QuestionRequest(BaseModel):
    question: str

def get_valid_tenant(tenant_id: str) -> str:
    validate_tenant_exists(tenant_id)
    return tenant_id

@router.post("/ask/{tenant_id}")
def ask_question(
    tenant_id: str = Depends(get_valid_tenant),
    payload: QuestionRequest = Body(...),
    session_id: str = Query(..., description="Unique session ID per user (e.g., UUID)")
):
    try:
        answer = qa_engine_ask_question(tenant_id, session_id, payload.question)
        return {"answer": answer}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))