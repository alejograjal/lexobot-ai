import os
import shutil
from app.core.config import settings
from app.services.embedder import embedding_model
from langchain_community.vectorstores import Chroma
from app.services.loader import load_all_pdfs_and_split

if os.path.exists(settings.VECTORSTORE_PATH):
    shutil.rmtree(settings.VECTORSTORE_PATH)

chunks = load_all_pdfs_and_split(settings.PDF_FOLDER_PATH)

vectorstore = Chroma.from_texts(
    chunks,
    embedding=embedding_model,
    persist_directory=settings.VECTORSTORE_PATH
)