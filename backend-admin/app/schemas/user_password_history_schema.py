from pydantic import BaseModel

class UserPasswordHistoryBase(BaseModel):
    user_id: int
    plain_password: str
    password_hash: str

class UserPasswordHistoryCreate(UserPasswordHistoryBase):
    pass