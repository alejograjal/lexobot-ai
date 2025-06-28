import os
import asyncio
import logging
import chromadb
from typing import Dict
from app.core import settings
from functools import lru_cache
from collections import defaultdict
from langchain_chroma import Chroma
from .embedder import get_embedding_model
from app.utils import is_path_size_over_limit
from app.tenants import load_tenant_settings, get_tenant_path

collection_name = "langchain"
QA_CACHE_MAX_SIZE_MB = 200

_chroma_clients: Dict[str, chromadb.PersistentClient] = {}
_chroma_instances: Dict[str, Chroma] = {}
_chroma_locks: Dict[str, asyncio.Lock] = defaultdict(asyncio.Lock)

logger = logging.getLogger(__name__)

def _get_all_tenants_from_folders() -> list[str]:
    base_path = settings.TENANT_BASE_PATH
    try:
        return [name for name in os.listdir(base_path)
                if os.path.isdir(os.path.join(base_path, name))]
    except Exception as e:
        logger.error(f"Error leyendo tenants: {e}")
        return []

def _get_or_create_chroma_client(tenant_id: str, path: str) -> chromadb.PersistentClient:
    if tenant_id not in _chroma_clients:
        _chroma_clients[tenant_id] = chromadb.PersistentClient(path=path)
    return _chroma_clients[tenant_id]

async def get_qa_cache_store(tenant_id: str) -> Chroma:
    if tenant_id in _chroma_instances:
        return _chroma_instances[tenant_id]
    
    async with _chroma_locks[tenant_id]:
        if tenant_id in _chroma_instances:
            return _chroma_instances[tenant_id]
    
        conf = await load_tenant_settings(tenant_id)
        cache_path = os.path.join(get_tenant_path(tenant_id), conf["qa_cache_path"])

        chroma_client = _get_or_create_chroma_client(tenant_id, cache_path)

        embedding_function = await get_embedding_model(tenant_id)

        chroma_instance = Chroma(
            client=chroma_client,
            collection_name=collection_name,
            embedding_function=embedding_function
        )

        _chroma_instances[tenant_id] = chroma_instance
        return chroma_instance
    
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
            logger.error(f"Error cleaning cache for {tenant_id}: {e}")

async def clean_cache_controlled(tenant_id: str, force: bool = False):
    conf = await load_tenant_settings(tenant_id)
    cache_path = os.path.join(get_tenant_path(tenant_id), conf["qa_cache_path"])
    
    if is_path_size_over_limit(cache_path, QA_CACHE_MAX_SIZE_MB) or force:
        chroma_client = chromadb.PersistentClient(path=cache_path)
        collection = chroma_client.get_collection(collection_name)
        await asyncio.to_thread(
            collection.delete,
            where={"tenant_id": tenant_id}
        )

        clear_chroma_cache(tenant_id)

def clear_chroma_cache(tenant_id: str | None = None):
    if tenant_id:
        _chroma_clients.pop(tenant_id, None)
        _chroma_instances.pop(tenant_id, None)
    else:
        _chroma_clients.clear()
        _chroma_instances.clear()