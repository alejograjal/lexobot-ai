from fastapi import APIRouter

router = APIRouter()

@router.post("/login")
def ask_question():
    return {"message": "Login endpoint is not implemented yet."}