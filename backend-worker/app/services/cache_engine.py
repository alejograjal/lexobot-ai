import os
import asyncio
import chromadb
from app.core import settings
from langchain_chroma import Chroma
from .embedder import get_embedding_model
from app.utils import is_path_size_over_limit
from app.tenants import load_tenant_settings, get_tenant_path

collection_name = "langchain"
QA_CACHE_MAX_SIZE_MB = 200

def _get_all_tenants_from_folders() -> list[str]:
    base_path = settings.TENANT_BASE_PATH
    try:
        return [name for name in os.listdir(base_path)
                if os.path.isdir(os.path.join(base_path, name))]
    except Exception as e:
        print(f"Error leyendo tenants: {e}")
        return []

async def get_qa_cache_store(tenant_id: str) -> Chroma:
    conf = await load_tenant_settings(tenant_id)
    cache_path = os.path.join(get_tenant_path(tenant_id), conf["qa_cache_path"])
    embedding_function = await get_embedding_model(tenant_id)
    chroma_client = chromadb.PersistentClient(path=cache_path)
    return Chroma(
        client=chroma_client,
        collection_name=collection_name,
        embedding_function=embedding_function
    )

async def run_periodic_cleanup(interval_seconds: int = 86400):
    while True:
        await _periodic_cache_cleanup()
        await asyncio.sleep(interval_seconds)

async def _periodic_cache_cleanup():
    tenants = _get_all_tenants_from_folders()
    for tenant_id in tenants:
        try:
            await clean_cache_controlled(tenant_id)
        except Exception as e:
            print(f"Error cleaning cache for {tenant_id}: {e}")

async def clean_cache_controlled(tenant_id: str, force: bool = False):
    conf = await load_tenant_settings(tenant_id)
    cache_path = os.path.join(get_tenant_path(tenant_id), conf["qa_cache_path"])
    
    if is_path_size_over_limit(cache_path, QA_CACHE_MAX_SIZE_MB) or force:
        chroma_client = chromadb.PersistentClient(path=cache_path)
        collection = chroma_client.get_collection(collection_name)
        collection.delete(where={"tenant_id": tenant_id})