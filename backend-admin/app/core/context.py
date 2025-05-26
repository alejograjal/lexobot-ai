from typing import Optional
from contextvars import ContextVar

current_user: ContextVar[Optional[str]] = ContextVar('current_user', default=None)

class UserContext:
    def __init__(self, username: str):
        self.username = username
        self.token = None

    def __enter__(self):
        self.token = current_user.set(self.username)
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        current_user.reset(self.token)