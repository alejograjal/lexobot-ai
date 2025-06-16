from fastapi import HTTPException

from app.tenants import load_tenant_settings

def validate_tenant_exists(tenant_id: str) -> None:
    try:
        load_tenant_settings(tenant_id)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail=f"Tenant '{tenant_id}' config not found")