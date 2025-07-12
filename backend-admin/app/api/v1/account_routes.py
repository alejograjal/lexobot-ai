from app.db import get_db
from app.services import UserService
from app.core import require_any_role
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import APIRouter, Depends, status, Query
from app.schemas import UserUpdate, UserResponse, ChangePasswordRequest, common_errors, not_found_error, validation_error, duplicate_entry_error

router = APIRouter(
    prefix="/accounts",
    tags=["Accounts"],
    dependencies=[Depends(require_any_role)]
)

user_service = UserService()

@router.patch("", response_model=UserResponse, responses={
    **common_errors,
    **not_found_error,
    **validation_error,
    **duplicate_entry_error
})
async def update_user_account(
    user_data: UserUpdate,
    db: AsyncSession = Depends(get_db)
) -> UserResponse:
    return await user_service.update_user_account(db, user_data)


@router.post("/change-password", response_model=bool, responses={
    **common_errors,
    **not_found_error,
    **validation_error
})
async def change_password(
    data: ChangePasswordRequest,
    db: AsyncSession = Depends(get_db)
) -> bool:
    await user_service.change_user_password(db, data)

    return True