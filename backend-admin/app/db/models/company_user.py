from .base import BaseModel
from sqlalchemy.orm import relationship
from sqlalchemy import (Column, Integer, ForeignKey, UniqueConstraint, Boolean, false)

class CompanyUser(BaseModel):
    __tablename__ = 'company_users'
    company_id = Column(Integer, ForeignKey('companies.id'), nullable=False)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    assign = Column(Boolean, default=True, server_default=false(), nullable=False)

    company = relationship("Company", backref="assigned_users", lazy="selectin")
    user = relationship("User", backref="assigned_companies", lazy="selectin")

    __table_args__ = (
        UniqueConstraint('company_id', 'user_id', name='_company_user_uc'),
    )