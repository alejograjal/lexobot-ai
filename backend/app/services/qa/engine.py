from app.services.qa.llm_chain import run_llm_chain
from app.services.qa.vectorstore import get_vectorstore_docs
from app.services.qa.cache_handler import get_similar_answer_or_none, store_answer_if_needed

def ask_question(question: str) -> str:
    cached_response = get_similar_answer_or_none(question)
    if cached_response:
        return cached_response

    docs = get_vectorstore_docs(question)
    response = run_llm_chain(docs, question)
    store_answer_if_needed(question, response)

    return response
