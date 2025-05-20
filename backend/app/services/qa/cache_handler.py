from app.services.embedder import embedding_model
from app.cache.embedding_cache import get_or_embed
from app.utils.similarity import are_questions_similar
from app.services.cache_engine import qa_cache_store, clean_cache_controlled

def get_similar_answer_or_none(question: str) -> str | None:
    try:
        query_embedding = get_or_embed(question)
        similar_docs = qa_cache_store.similarity_search_by_vector(query_embedding, k=1)
        
        if similar_docs:
            cached_doc = similar_docs[0]
            cached_question = cached_doc.metadata.get("question", "")
            if are_questions_similar(question, cached_question):
                return cached_doc.page_content
    except Exception as e:
        print(f"Error en caché: {str(e)}")
    
    return None


def store_answer_if_needed(question: str, answer: str):
    clean_cache_controlled()

    qa_cache_store.add_texts([answer], metadatas=[{"question": question}])
    
