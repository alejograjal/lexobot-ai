import json
from pathlib import Path
from app.core import settings
from cachetools import TTLCache

SECRETS_FILE = Path(settings.SECRETS_PATH)
_cache = TTLCache(maxsize=1, ttl=60)

def _load_secrets() -> dict[str, str]:
    with SECRETS_FILE.open() as f:
        return json.load(f)

def get_tenant_secret(company_access_id: str) -> str | None:
    if "secrets" not in _cache:
        _cache["secrets"] = _load_secrets()
    secrets = _cache["secrets"]
    return secrets.get(company_access_id)