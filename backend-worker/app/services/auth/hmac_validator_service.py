import hmac
import time
import hashlib
from app.core import CompanyNotFoundError, InvalidHMACSignatureError, TokenExpiredError

class HMACValidatorService:
    def __init__(self, secret_provider):
        self.secret_provider = secret_provider

    def validate(self, company_access_id: str, timestamp: str, signature: str, max_skew_seconds: int = 60):
        secret = self.secret_provider(company_access_id)
        if not secret:
            raise CompanyNotFoundError(company_access_id)

        current_time = int(time.time())
        request_time = int(timestamp)

        if abs(current_time - request_time) > max_skew_seconds:
            raise TokenExpiredError(request_time, current_time)

        message = f"{company_access_id}:{timestamp}"
        expected_signature = hmac.new(secret.encode(), message.encode(), hashlib.sha256).hexdigest()

        if not hmac.compare_digest(expected_signature, signature):
            raise InvalidHMACSignatureError(company_access_id)
