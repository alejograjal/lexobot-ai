import secrets
import string
from datetime import datetime, timedelta, timezone, date

CR_TZ_OFFSET = timedelta(hours=-6)

def generate_temp_password(length: int = 12) -> str:
    characters = string.ascii_letters + string.digits + "!@#$%^&*()-_=+"
    return ''.join(secrets.choice(characters) for _ in range(length))

def get_cr_today_date() -> date:
    cr_now = datetime.now(timezone.utc) + CR_TZ_OFFSET
    return cr_now.date()