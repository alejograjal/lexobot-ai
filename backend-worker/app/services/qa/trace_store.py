import json
import hashlib
from app.core import redis_client
from datetime import datetime, timezone
from langchain_core.documents import Document

def compute_docs_hash(docs: list[Document]) -> str:
    contents = [doc.page_content for doc in docs]
    content_str = json.dumps(sorted(contents), ensure_ascii=False)
    return hashlib.sha256(content_str.encode("utf-8")).hexdigest()

async def store_docs_if_needed(docs_hash: str, docs: list[Document]):
    key = f"docs:{docs_hash}"
    exists = await redis_client.exists(key)

    if not exists:
        doc_data = [
            {
                "metadata": doc.metadata,
                "content": doc.page_content[:1000], 
            }
            for doc in docs
        ]
        await redis_client.set(key, json.dumps(doc_data, ensure_ascii=False), ex=60 * 60 * 24 * 7) 

async def store_trace_entry(tenant_id: str, question: str, answer: str, docs_hash: str):
    timestamp = datetime.now(timezone.utc).isoformat()
    key = f"trace:{tenant_id}:{timestamp}"
    data = {
        "question": question,
        "answer": answer,
        "docs_hash": docs_hash
    }
    await redis_client.set(key, json.dumps(data, ensure_ascii=False), ex=60 * 60 * 24 * 7)
