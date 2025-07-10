from app.db import get_db
from fastapi import Query
from http.client import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import APIRouter, Depends, Request
from app.services import AuthService, UserService
from app.schemas import LoginRequest, TokenResponse, RefreshTokenRequest, ErrorResponse, common_errors, not_found_error, validation_error, UserAccountConfirmation, UserChangePassword, ResetPasswordRequest

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

auth_service = AuthService()
user_service = UserService()

@router.post("/login", response_model=TokenResponse, responses={**common_errors})
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

@router.post("/refresh", response_model=TokenResponse, responses={
    500: {"model": ErrorResponse, "description": "Internal server error"},
    401: {"model": ErrorResponse, "description": "Unauthorized"},
})
async def refresh_token(refresh_token: RefreshTokenRequest, db: AsyncSession = Depends(get_db)):
    """
    Get a new access token using a refresh token
    """
    return await auth_service.refresh_access_token(db=db, refresh_token=refresh_token.refresh_token)

@router.get("/user/validate-token", response_model=bool, responses={
    **common_errors,
    **not_found_error,
    **validation_error
})
async def confirm_user(
    confirmation_token: str | None = Query(default=None),
    reset_password_token: str | None = Query(default=None),
    db: AsyncSession = Depends(get_db)
):
    if confirmation_token:
        return await user_service.validate_confirmation_token(db, confirmation_token)
    elif reset_password_token:
        return await user_service.validate_reset_password_token(db, reset_password_token)
    
    raise HTTPException(status_code=400, detail="Debe enviar 'confirmation_token' o 'reset_password_token'")

@router.get("/user/check-availability", response_model=bool, responses={**common_errors})
async def check_availability(
    user_name: str | None = Query(default=None),
    phone_number: str | None = Query(default=None),
    db: AsyncSession = Depends(get_db)
):
    if user_name:
        return await user_service.check_user_name_availability(db, user_name)
    elif phone_number:
        return await user_service.check_phone_number_availability(db, phone_number)
    
    raise HTTPException(status_code=400, detail="Debe enviar 'user_name' o 'phone_number'")

@router.post("/user/confirm/{token}", response_model=bool, responses={
    **common_errors,
    **not_found_error,
    **validation_error
})
async def confirm_user(token: str, user_account_confirmation: UserAccountConfirmation, db: AsyncSession = Depends(get_db)):
    return await user_service.confirm_account(db, token, user_account_confirmation)

@router.post("/user/password-reset", response_model=bool, responses={
    **common_errors,
    **not_found_error,
    **validation_error
})
async def reset_password(reset_password_request: ResetPasswordRequest, db: AsyncSession = Depends(get_db)):
    await user_service.request_password_reset(db, reset_password_request)
    return True

@router.post("/user/password-change/{token}", response_model=bool, responses={
    **common_errors,
    **not_found_error,
    **validation_error
})
async def reset_password(token: str, user_change_password: UserChangePassword, db: AsyncSession = Depends(get_db)):
    await user_service.change_password(db, token, user_change_password)

    return True