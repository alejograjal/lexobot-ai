from .base import BaseModel
from sqlalchemy.orm import relationship
from sqlalchemy import Column, Integer, String, ForeignKey

class User(BaseModel):
    __tablename__ = 'users'
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    phone_number = Column(String(20), nullable=True)
    username = Column(String(50), unique=True, nullable=True, index=True)
    password_hash = Column(String(255), nullable=True)

    role_id = Column(Integer, ForeignKey('roles.id'), nullable=False)
    role = relationship("Role")

    login_attempts = relationship("LoginAttempt", back_populates="user", cascade="all, delete-orphan", lazy="selectin")
    password_history = relationship("UserPasswordHistory", back_populates="user", cascade="all, delete-orphan", lazy="selectin")
    tokens = relationship("UserToken", back_populates="user", cascade="all, delete-orphan", lazy="selectin")