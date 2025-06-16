import os
import json
from pathlib import Path
from app.core import settings

def create_tenant(client_name: str, tenant_id: str, openai_api_key: str):
    tenant_dir = Path(settings.TENANT_BASE_PATH) / tenant_id
    docs_dir = tenant_dir / "docs"
    vectorstore_dir = tenant_dir / "vectorstore"
    cache_dir = tenant_dir / "cache"

    docs_dir.mkdir(parents=True, exist_ok=True)
    vectorstore_dir.mkdir(parents=True, exist_ok=True)
    cache_dir.mkdir(parents=True, exist_ok=True)

    settings_json = {
        "openai_api_key": openai_api_key,
        "docs_folder": "docs",
        "vectorstore_path": "vectorstore",
        "qa_cache_path": "cache",
        "redis_namespace": tenant_id,
        "client-name": client_name
    }

    with open(tenant_dir / "settings.json", "w") as f:
        json.dump(settings_json, f, indent=4)
