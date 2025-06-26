import os
import chromadb
from langchain_community.vectorstores import Chroma
from app.tenants import load_tenant_settings, get_tenant_path
from app.services import load_all_pdfs_and_split_with_metadata
from app.services import get_embedding_model, clean_cache_controlled
from app.core import DocumentNotFoundForVectorstoreError, TenantConfigNotFoundError

async def build_vectorstore_for_tenant(tenant_id: str):
    try:
        settings = await load_tenant_settings(tenant_id)
        base_path = get_tenant_path(tenant_id)

        docs_folder = os.path.join(base_path, settings["docs_folder"])
        vectorstore_path = os.path.join(base_path, settings["vectorstore_path"])

        texts, metadatas = await load_all_pdfs_and_split_with_metadata(tenant_id, docs_folder)

        if not texts:
            raise DocumentNotFoundForVectorstoreError(tenant_id)

        embedding_model = await get_embedding_model(tenant_id)

        if os.path.exists(vectorstore_path):
            chroma_client = chromadb.PersistentClient(path=vectorstore_path)
            collection = chroma_client.get_or_create_collection(name="langchain")
            collection.delete(where={"tenant_id": tenant_id})

        Chroma.from_texts(
            texts,
            embedding=embedding_model,
            metadatas=metadatas,
            persist_directory=vectorstore_path
        )

        await clean_cache_controlled(tenant_id, force=True)
    except (TenantConfigNotFoundError, DocumentNotFoundForVectorstoreError) as e:
        raise e
    except Exception as e:
        raise Exception(f"Failed to build vectorstore for tenant {tenant_id}: {str(e)}")