from app.db import get_db
from typing import Optional
from app.services import MeService
from app.core import require_any_role
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas import UserProfile, common_errors

router = APIRouter(
    prefix="/me",
    tags=["Me"],
    dependencies=[Depends(require_any_role)]
)

me_service = MeService()

@router.get("", response_model=Optional[UserProfile], responses={**common_errors})
async def get_profile(db: AsyncSession = Depends(get_db)):
    """
    Get current user profile
    """
    return await me_service.get_current_user(db=db)