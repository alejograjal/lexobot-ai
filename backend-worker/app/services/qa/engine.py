from .llm_chain import run_llm_chain
from app.utils import is_asking_for_sources
from .vectorstore import retrieve_relevant_docs
from .cache_handler import get_similar_answer_or_none, store_answer_if_needed

def ask_question(tenant_id: str, session_id: str, question: str) -> str:
    cached_response, sources = get_similar_answer_or_none(tenant_id, question)

    if is_asking_for_sources(question):
        if sources:
            return "Fuentes:\n" + "\n".join(sources)
        else:
            return "No tengo las fuentes guardadas para esa respuesta."

    # if cached_response:
    #     if sources:
    #         fuentes_texto = "\n\nFuentes:\n" + "\n".join(sources)
    #         return cached_response + fuentes_texto
    #     return cached_response
    
    docs = retrieve_relevant_docs(tenant_id, question)
    response = run_llm_chain(tenant_id, session_id, docs, question)
    store_answer_if_needed(tenant_id, question, response, docs)

    return response
