import httpx
from app.core import settings

class BrevoClient:
    BASE_URL = "https://api.brevo.com/v3/smtp/email"

    def __init__(self):
        self.headers = {
            "api-key": settings.BREVO_API_KEY,
            "Content-Type": "application/json"
        }

    async def send_email(self, payload: dict):
        async with httpx.AsyncClient() as client:
            response = await client.post(self.BASE_URL, json=payload, headers=self.headers)
            response.raise_for_status()
            return response.json()
