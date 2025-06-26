from uuid import UUID
from typing import Dict, Any
from pydantic import BaseModel, Field
from app.core import TenantNotFoundError
from app.tenants import validate_tenant_exists
from app.services import ask_question as qa_engine_ask_question 
from fastapi import APIRouter, HTTPException, Depends, Body, Header, status

router = APIRouter(
    prefix="/ask",
    tags=["QA"],
    responses={
        404: {"description": "Tenant not found"},
        500: {"description": "Internal server error"}
    }
)

class QuestionRequest(BaseModel):
    question: str = Field(..., min_length=1, max_length=1000, description="The question to ask")
    
    class Config:
        json_schema_extra = {
            "example": {
                "question": "What is the meaning of life?"
            }
        }

class QuestionResponse(BaseModel):
    answer: str

async def validate_session_id(
    x_session_id: str = Header(..., alias="X-Session-ID", description="Unique session identifier")
) -> UUID:
    """Validate session ID format."""
    try:
        return UUID(x_session_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid session ID format. Must be a valid UUID."
        )

async def get_valid_tenant(tenant_id: str) -> str:
    """Validate tenant existence."""
    try:
        await validate_tenant_exists(tenant_id)
        return tenant_id
    except TenantNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Tenant {tenant_id} not found"
        )

@router.post(
    "/{tenant_id}",
    response_model=QuestionResponse,
    status_code=status.HTTP_200_OK,
    summary="Ask a question",
    description="Submit a question to be answered by the QA engine"
)
async def ask_question(
    tenant_id: str = Depends(get_valid_tenant),
    session_id: UUID = Depends(validate_session_id),
    payload: QuestionRequest = Body(...),
) -> Dict[str, Any]:
    """
    Ask a question to the QA engine.
    
    Args:
        tenant_id: The tenant identifier
        session_id: UUID for the conversation session
        payload: The question request body
    
    Returns:
        Dict containing the answer
    """
    try:
        answer = await qa_engine_ask_question(
            tenant_id=tenant_id,
            session_id=str(session_id),
            question=payload.question
        )
        return {"answer": answer}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )