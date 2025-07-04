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

    async def _get_hmac_token(self, company_access_id: str, external_id: str, ttl: int = 60) -> dict:
        params = {"company_access_id": company_access_id, "ttl": ttl}
        headers = {
            "X-Tenant-Id": external_id
        }
        response = await self.client.get(f"/token/hmac", params=params, headers=headers)
        response.raise_for_status()
        return response.json()

    async def upload_document(self, company_access_id: str, file_bytes: bytes, document_name: str, external_id: str) -> dict:
        token = await self._get_hmac_token(company_access_id, external_id)
        headers = {
            "X-Company-Access-Id": token["company_access_id"],
            "X-Timestamp": token["timestamp"],
            "X-Signature": token["signature"],
            "X-Tenant-Id": external_id
        }
        files = {
            "file": (document_name, file_bytes, "application/pdf"),
            "document_name": (None, document_name),
            "external_id": (None, external_id)
        }
        response = await self.client.post(f"/api/upload-document", files=files, headers=headers)
        response.raise_for_status()
        return response.json()
    
    async def remove_document(self, company_access_id: str, document_name: str, external_id: str) -> dict:
        token = await self._get_hmac_token(company_access_id, external_id)
        headers = {
            "X-Company-Access-Id": token["company_access_id"],
            "X-Timestamp": token["timestamp"],
            "X-Signature": token["signature"],
            "X-Tenant-Id": external_id
        }
        params = {"external_id": external_id}
        response = await self.client.delete(f"/api/remove-document/{document_name}", params=params, headers=headers)
        response.raise_for_status()
        return response.json()

    async def build_vectorstore(self, company_access_id: str,external_id: str) -> dict:
        token = await self._get_hmac_token(company_access_id, external_id)
        headers = {
            "X-Company-Access-Id": token["company_access_id"],
            "X-Timestamp": token["timestamp"],
            "X-Signature": token["signature"],
            "X-Tenant-Id": external_id
        }
        response = await self.client.post(f"/api/build-vectorstore/{external_id}", headers=headers, timeout=90)
        response.raise_for_status()
        return response.json()
    
    async def get_metrics(self, company_access_id: str, external_id: str, start_date: str, end_date: str) -> dict:
        token = await self._get_hmac_token(company_access_id, external_id)
        headers = {
            "X-Company-Access-Id": token["company_access_id"],
            "X-Timestamp": token["timestamp"],
            "X-Signature": token["signature"],
            "X-Tenant-Id": external_id
        }
        response = await self.client.get(f"/api/metrics/{external_id}", headers=headers, params={"start_date": start_date, "end_date": end_date})

        response.raise_for_status()
        return response.json()
