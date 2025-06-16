import os
from app.cache import get_or_embed
from langchain_chroma import Chroma
from ..embedder import get_embedding_model
from app.tenants import load_tenant_settings, get_tenant_path

def get_vectorstore(tenant_id: str):
    tenant_conf = load_tenant_settings(tenant_id)
    path = os.path.join(get_tenant_path(tenant_id), tenant_conf["vectorstore_path"])
    return Chroma(
        persist_directory=path,
        embedding_function=get_embedding_model(tenant_id)
    )

def retrieve_relevant_docs(tenant_id: str, question: str):
    store = get_vectorstore(tenant_id)
    embedding = get_or_embed(tenant_id, question)
    return store.similarity_search_by_vector(embedding)
