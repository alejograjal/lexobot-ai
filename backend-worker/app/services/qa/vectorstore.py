import os
from datetime import datetime
from app.cache import get_or_embed
from langchain_chroma import Chroma
from ..embedder import get_embedding_model
from app.tenants import load_tenant_settings, get_tenant_path

async def get_vectorstore(tenant_id: str):
    tenant_conf = await load_tenant_settings(tenant_id)
    path = os.path.join(get_tenant_path(tenant_id), tenant_conf["vectorstore_path"])
    embedding_function = await get_embedding_model(tenant_id)
    return Chroma(
        persist_directory=path,
        embedding_function=embedding_function
    )

async def retrieve_relevant_docs(tenant_id: str, question: str):
    store = await get_vectorstore(tenant_id)
    embedding = await get_or_embed(tenant_id, question)
    docs = store.similarity_search_by_vector(embedding, k=20)

    def parse_date(doc):
        date_str = doc.metadata.get("date")
        if not date_str:
            return datetime.min
        try:
            return datetime.fromisoformat(date_str)
        except Exception:
            return datetime.min

    docs_sorted = sorted(docs, key=parse_date, reverse=True)

    return docs_sorted
