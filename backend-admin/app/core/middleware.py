from fastapi import Request
from .context import UserContext
from .security import SecurityHandler
from starlette.middleware.base import BaseHTTPMiddleware

class AuditMiddleware(BaseHTTPMiddleware):
     async def dispatch(self, request: Request, call_next):
        auth = request.headers.get('Authorization')
        
        if auth and auth.startswith('Bearer '):
            token = auth.split(' ')[1]
            payload = SecurityHandler.verify_token(token)
            
            if payload and payload.get("username"):
                with UserContext(payload["username"]):
                    response = await call_next(request)
                    return response
        
        return await call_next(request)