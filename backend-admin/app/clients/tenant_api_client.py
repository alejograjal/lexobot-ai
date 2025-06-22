import httpx
from app.core import settings

class TenantApiClient:
    def __init__(self):
        self.base_url = settings.TENANT_WORKER_API_URL
        self.client = None

    async def __aenter__(self):
        self.client = httpx.AsyncClient(base_url=self.base_url)
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        await self.client.aclose()

    async def _get_hmac_token(self, company_access_id: str, ttl: int = 60) -> dict:
        params = {"company_access_id": company_access_id, "ttl": ttl}
        response = await self.client.get("/token/hmac", params=params)
        response.raise_for_status()
        return response.json()

    async def upload_document(self, company_access_id: str, file_bytes: bytes, document_name: str, external_id: str) -> dict:
        token = await self._get_hmac_token(company_access_id)
        headers = {
            "X-Company-Access-Id": token["company_access_id"],
            "X-Timestamp": token["timestamp"],
            "X-Signature": token["signature"]
        }
        files = {
            "file": (document_name, file_bytes, "application/pdf"),
            "document_name": (None, document_name),
            "external_id": (None, external_id)
        }
        response = await self.client.post("/api/upload-document", files=files, headers=headers)
        response.raise_for_status()
        return response.json()
    
    async def remove_document(self, company_access_id: str, document_name: str, external_id: str) -> dict:
        token = await self._get_hmac_token(company_access_id)
        headers = {
            "X-Company-Access-Id": token["company_access_id"],
            "X-Timestamp": token["timestamp"],
            "X-Signature": token["signature"]
        }
        params = {"external_id": external_id}
        response = await self.client.delete(f"/api/remove-document/{document_name}", params=params, headers=headers)
        response.raise_for_status()
        return response.json()

    async def build_vectorstore(self, company_access_id: str,external_id: str) -> dict:
        token = await self._get_hmac_token(company_access_id)
        headers = {
            "X-Company-Access-Id": token["company_access_id"],
            "X-Timestamp": token["timestamp"],
            "X-Signature": token["signature"]
        }
        response = await self.client.post(f"/api/build-vectorstore/{external_id}", headers=headers, timeout=90)
        response.raise_for_status()
        return response.json()
