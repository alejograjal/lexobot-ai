from .base import BaseModel
from sqlalchemy.orm import relationship
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey

class UserPasswordHistory(BaseModel):
    __tablename__ = 'user_password_history'

    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    password_hash = Column(String(255), nullable=False)

    user = relationship("User", back_populates="password_history")