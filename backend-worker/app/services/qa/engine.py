from .llm_chain import run_llm_chain
from .vectorstore import retrieve_relevant_docs
from .cache_handler import get_similar_answer_or_none, store_answer_if_needed

def ask_question(tenant_id: str, session_id: str, question: str) -> str:
    cached_response, sources = get_similar_answer_or_none(tenant_id, question)

    if cached_response:
        return cached_response
    
    docs = retrieve_relevant_docs(tenant_id, question)
    response = run_llm_chain(tenant_id, session_id, docs, question)
    store_answer_if_needed(tenant_id, question, response, docs)

    return response
