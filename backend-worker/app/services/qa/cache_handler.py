import asyncio
import logging
from typing import Tuple
from app.cache import get_or_embed
from ..cache_engine import get_qa_cache_store
from app.utils import are_questions_semantically_similar
from .trace_store import compute_docs_hash, store_docs_if_needed, store_trace_entry

logger = logging.getLogger(__name__)

async def get_similar_answer_or_none(tenant_id: str, question: str) -> Tuple[str, list[str]] | Tuple[None, None]:
    try:
        query_embedding = await get_or_embed(tenant_id, question) 
        qa_cache_store = await get_qa_cache_store(tenant_id)
        similar_docs = await asyncio.to_thread(
            qa_cache_store.similarity_search_by_vector,
            query_embedding,
            k=1
        )
        
        if similar_docs:
            cached_doc = similar_docs[0]
            cached_question = cached_doc.metadata.get("question", "")
            if await are_questions_semantically_similar(tenant_id, question, cached_question):
                answer = cached_doc.page_content
                sources = cached_doc.metadata.get("sources", [])
                if isinstance(sources, str):
                    sources = [s.strip() for s in sources.split(",")]
                    
                return answer, sources, cached_question
    except Exception as e:
        logger.warning(f"Error en caché: {str(e)}")
    
    return None, None, None


async def store_answer_if_needed(tenant_id: str, question: str, answer: str, docs: list):
    qa_cache_store = await get_qa_cache_store(tenant_id)
    doc_refs = [doc.metadata.get("source", f"doc_{i}") for i, doc in enumerate(docs)]
    await asyncio.to_thread(
        qa_cache_store.add_texts,
        [answer],
        metadatas=[{
            "question": question,
            "sources": ", ".join(doc_refs),
            "tenant_id": tenant_id
        }]
    )

    docs_hash = compute_docs_hash(docs)
    await store_docs_if_needed(docs_hash, docs)
    await store_trace_entry(tenant_id, question, answer, docs_hash)
    
