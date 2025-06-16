import secrets
import string

def generate_temp_password(length: int = 12) -> str:
    characters = string.ascii_letters + string.digits + "!@#$%^&*()-_=+"
    return ''.join(secrets.choice(characters) for _ in range(length))