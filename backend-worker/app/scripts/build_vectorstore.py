import os
import shutil
from app.services import get_embedding_model
from app.services import load_all_pdfs_and_split
from langchain_community.vectorstores import Chroma
from app.tenants import load_tenant_settings, get_tenant_path

def build_vectorstore_for_tenant(tenant_id: str):
    settings = load_tenant_settings(tenant_id)
    base_path = get_tenant_path(tenant_id)

    docs_folder = os.path.join(base_path, settings["docs_folder"])
    vectorstore_path = os.path.join(base_path, settings["vectorstore_path"])

    if os.path.exists(vectorstore_path):
        shutil.rmtree(vectorstore_path)

    chunks = load_all_pdfs_and_split(docs_folder)

    embedding_model = get_embedding_model(tenant_id)

    Chroma.from_texts(
        chunks,
        embedding=embedding_model,
        persist_directory=vectorstore_path
    )

build_vectorstore_for_tenant("110ec58a-a0f2-4ac4-8393-c866d813b8d1")