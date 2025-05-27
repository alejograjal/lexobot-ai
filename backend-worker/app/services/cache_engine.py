import os
import chromadb
from langchain_chroma import Chroma
from .embedder import get_embedding_model
from app.utils import is_path_size_over_limit
from app.tenants import load_tenant_settings, get_tenant_path

collection_name = "langchain"
QA_CACHE_MAX_SIZE_MB = 200

def get_qa_cache_store(tenant_id: str) -> Chroma:
    conf = load_tenant_settings(tenant_id)
    cache_path = os.path.join(get_tenant_path(tenant_id), conf["qa_cache_path"])
    chroma_client = chromadb.PersistentClient(path=cache_path)
    return Chroma(
        client=chroma_client,
        collection_name=collection_name,
        embedding_function=get_embedding_model(tenant_id)
    )

def clean_cache_controlled(tenant_id: str):
    conf = load_tenant_settings(tenant_id)
    cache_path = os.path.join(get_tenant_path(tenant_id), conf["qa_cache_path"])
    
    if is_path_size_over_limit(cache_path, QA_CACHE_MAX_SIZE_MB):
        chroma_client = chromadb.PersistentClient(path=cache_path)
        collection = chroma_client.get_collection(collection_name)
        oldest_entries = collection.get(limit=50, include=["metadatas"]) 
        collection.delete(ids=oldest_entries["ids"])