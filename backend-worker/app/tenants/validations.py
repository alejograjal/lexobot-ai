from fastapi import HTTPException

from app.tenants import load_tenant_settings

async def validate_tenant_exists(tenant_id: str) -> None:
    try:
        await load_tenant_settings(tenant_id)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail=f"Tenant '{tenant_id}' config not found")