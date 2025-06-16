import os
import json
from app.core import settings

def get_tenant_path(tenant_id: str) -> str:
    return os.path.join(settings.TENANT_BASE_PATH, tenant_id)

def load_tenant_settings(tenant_id: str) -> dict:
    tenant_path = get_tenant_path(tenant_id)
    settings_path = os.path.join(tenant_path, "settings.json")

    if not os.path.exists(settings_path):
        raise FileNotFoundError(f"Tenant config not found for {tenant_id}")

    with open(settings_path, "r") as f:
        return json.load(f)