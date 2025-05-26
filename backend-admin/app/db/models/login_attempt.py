from .base import BaseModel
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey

class LoginAttempt(BaseModel):
    __tablename__ = "login_attempts"

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    ip_address = Column(String(45), nullable=False)
    attempts_count = Column(Integer, default=1)
    last_attempt = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="login_attempts")