import os
import json
import aiofiles
from app.core import settings, TenantConfigNotFoundError

def get_tenant_path(tenant_id: str) -> str:
    return os.path.join(settings.TENANT_BASE_PATH, tenant_id)

async def load_tenant_settings(tenant_id: str) -> dict:
    tenant_path = get_tenant_path(tenant_id)
    settings_path = os.path.join(tenant_path, "settings.json")

    if not os.path.exists(settings_path):
        raise TenantConfigNotFoundError(tenant_id)

    async with aiofiles.open(settings_path, "r") as f:
        content = await f.read()
        return json.loads(content)