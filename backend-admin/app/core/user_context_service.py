from .context import current_user

def get_current_username() -> str:
    user_info = current_user.get()
    if not user_info:
        return "api-lexobot"
    return user_info[0]

def get_current_role() -> str:
    user_info = current_user.get()
    if not user_info:
        raise ValueError("No user context found")
    return user_info[1]

def get_current_id() -> int:
    user_info = current_user.get()
    if not user_info:
        raise ValueError("No user context found")
    return int(user_info[2])