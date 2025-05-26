from app.db import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from app.services import AuthService
from fastapi import APIRouter, Depends, Request
from app.schemas import LoginRequest, TokenResponse, RefreshTokenRequest

router = APIRouter(
    prefix="/auth",
    tags=["authentication"]
)

auth_service = AuthService()

@router.post("/login", response_model=TokenResponse)
async def login(
    credentials: LoginRequest,
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    """
    Authenticate user and return access token
    """
    return await auth_service.attempt_login(
        db=db,
        username=credentials.username,
        password=credentials.password,
        request=request
    )

@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(refresh_token: RefreshTokenRequest, db: AsyncSession = Depends(get_db)):
    """
    Get a new access token using a refresh token
    """
    return await auth_service.refresh_access_token(db=db, refresh_token=refresh_token.refresh_token)