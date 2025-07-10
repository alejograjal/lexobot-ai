from .base import BaseModel
from app.core import TokenPurpose
from sqlalchemy.orm import relationship
from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey, Enum as SqlEnum

class UserToken(BaseModel):
    __tablename__ = 'user_tokens'

    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    token = Column(String(36), unique=True, nullable=False, index=True)
    purpose = Column(SqlEnum(TokenPurpose), nullable=False)
    expires_at = Column(DateTime(timezone=True), nullable=False)
    used = Column(Boolean, default=False)

    user = relationship("User", back_populates="tokens")