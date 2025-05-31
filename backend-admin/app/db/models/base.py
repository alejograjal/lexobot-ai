from datetime import datetime, timezone
from sqlalchemy.orm import declarative_base
from app.core.user_context_service import get_current_username
from sqlalchemy import Column, Integer, Boolean, String, DateTime, func, true, event

Base = declarative_base()

class BaseModel(Base):
    __abstract__ = True 

    id = Column(Integer, primary_key=True, index=True)
    created_by = Column(String(50), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_by = Column(String(50), nullable=True)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)
    is_active = Column(Boolean, default=True, server_default=true(), nullable=False)
    
@event.listens_for(BaseModel, 'before_insert', propagate=True)
def set_created_values(mapper, connection, target):
    """Automatically set created_by and created_at from JWT context"""
    target.created_by = get_current_username()
    target.created_at = datetime.now(timezone.utc)

@event.listens_for(BaseModel, 'before_update', propagate=True)
def set_updated_values(mapper, connection, target):
    """Automatically set updated_by and updated_at from JWT context"""
    target.updated_by = get_current_username()
    target.updated_at = datetime.now(timezone.utc)