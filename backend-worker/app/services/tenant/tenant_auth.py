import hmac
import time
import hashlib

class TenantAuthService:
    def __init__(self, secret_provider):
        self.secret_provider = secret_provider 

    def generate_token(self, company_access_id: str, ttl_seconds: int = 60):
        timestamp = str(int(time.time()))
        message = f"{company_access_id}:{timestamp}"
        secret = self.secret_provider(company_access_id)
        signature = hmac.new(secret.encode(), message.encode(), hashlib.sha256).hexdigest()
        return {
            "company_access_id": company_access_id,
            "timestamp": timestamp,
            "signature": signature,
            "expires_in": ttl_seconds
        }