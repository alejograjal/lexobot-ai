from app.core.config import settings
from langchain_openai import OpenAIEmbeddings

embedding_model = OpenAIEmbeddings(
    model=settings.EMBEDDING_MODEL,
    openai_api_key=settings.OPENAI_API_KEY
)

def embed_chunks(chunks):
    return embedding_model.embed_documents(chunks)