from app.core.config import settings
from app.services.embedder import embedding_model
from langchain_chroma import Chroma

vectorstore = Chroma(
    persist_directory=settings.VECTORSTORE_PATH,
    embedding_function=embedding_model
)

def get_vectorstore_docs(question: str):
    return vectorstore.similarity_search(question)
