import chromadb
from langchain_chroma import Chroma
from app.core.config import settings
from app.services.embedder import embedding_model
from app.utils.filesystem import is_path_size_over_limit

chroma_client = chromadb.PersistentClient(path=settings.QA_CACHE_PATH)
collection_name = "langchain"
QA_CACHE_MAX_SIZE_MB = 200

def clean_cache_controlled():
    collection = chroma_client.get_collection(collection_name)
    
    if is_path_size_over_limit(settings.QA_CACHE_PATH, QA_CACHE_MAX_SIZE_MB):
        oldest_entries = collection.get(limit=50, include=["metadatas"]) 
        collection.delete(ids=oldest_entries["ids"])
    
try:
    qa_cache_store = Chroma(
        client=chroma_client,
        collection_name=collection_name,
        embedding_function=embedding_model
    )
    clean_cache_controlled() 
except:
    
    chroma_client.delete_collection(collection_name)
    qa_cache_store = Chroma(
        client=chroma_client,
        collection_name=collection_name,
        embedding_function=embedding_model
    )