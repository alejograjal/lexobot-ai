from pydantic import BaseModel
from app.tenants.validations import validate_tenant_exists
from fastapi import APIRouter, HTTPException, Depends, Body
from app.services.qa.engine import ask_question as qa_engine_ask_question 

router = APIRouter()

class QuestionRequest(BaseModel):
    question: str

def get_valid_tenant(tenant_id: str) -> str:
    validate_tenant_exists(tenant_id)
    return tenant_id

@router.post("/ask/{tenant_id}")
def ask_question(tenant_id: str = Depends(get_valid_tenant), payload: QuestionRequest = Body(...)):
    try:
        answer = qa_engine_ask_question(tenant_id, payload.question)
        return {"answer": answer}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))