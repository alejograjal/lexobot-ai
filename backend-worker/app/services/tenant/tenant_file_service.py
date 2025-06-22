import os
from app.core import settings
from fastapi import UploadFile
from app.core import TenantDocumentNotFoundError

class TenantFileService:
    def __init__(self):
        self.base_path = settings.TENANT_BASE_PATH

    async def save_document(self, file: UploadFile, document_name: str, external_id: str) -> str:
        dest_folder = os.path.join(self.base_path, external_id, "docs")
        os.makedirs(dest_folder, exist_ok=True)

        dest_path = os.path.join(dest_folder, document_name)

        with open(dest_path, "wb") as f:
            f.write(await file.read())

        return dest_path
    
    def remove_document(self, document_name: str, external_id: str) -> None:
        file_path = os.path.join(self.base_path, external_id, "docs", document_name)

        if not os.path.exists(file_path):
            raise TenantDocumentNotFoundError(document_name, external_id)

        os.remove(file_path)
