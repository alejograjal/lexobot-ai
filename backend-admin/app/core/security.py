from .config import settings
from jose import JWTError, jwt
from typing import Optional, Dict
from fastapi.security import HTTPBearer
from passlib.context import CryptContext
from datetime import datetime, timedelta, timezone

class SecurityConfig:
    SECRET_KEY: str = settings.SECRET_KEY
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    PWD_CONTEXT = CryptContext(
        schemes=["bcrypt"],
        deprecated="auto",
        bcrypt__rounds=12
    )

    MAX_LOGIN_ATTEMPTS: int = 5
    LOCKOUT_MINUTES: int = 15

    AUTH_SCHEME = "Bearer"

class SecurityHandler:
    security_scheme = HTTPBearer(
        scheme_name="JWT",
        description="Enter JWT token",
        auto_error=True
    )

    @staticmethod
    def create_access_token(
        subject: str,
        additional_data: Dict = None,
        expires_delta: Optional[timedelta] = None
    ) -> str:
        """Create a new access token"""
        if expires_delta:
            expire = datetime.now(timezone.utc) + expires_delta
        else:
            expire = datetime.now(timezone.utc) + timedelta(
                minutes=SecurityConfig.ACCESS_TOKEN_EXPIRE_MINUTES
            )

        to_encode = {
            "exp": expire,
            "sub": str(subject),
            "iat": datetime.now(timezone.utc),
            "type": "access"
        }

        if additional_data:
            to_encode.update(additional_data)
        
        return jwt.encode(
            to_encode,
            SecurityConfig.SECRET_KEY,
            SecurityConfig.ALGORITHM
        )
    
    @staticmethod
    def create_refresh_token(subject: str) -> str:
        """Create a new refresh token"""
        expire = datetime.now(timezone.utc) + timedelta(
            days=SecurityConfig.REFRESH_TOKEN_EXPIRE_DAYS
        )
        
        to_encode = {
            "exp": expire,
            "sub": str(subject),
            "iat": datetime.now(timezone.utc),
            "type": "refresh"
        }
        
        return jwt.encode(
            to_encode,
            SecurityConfig.SECRET_KEY,
            SecurityConfig.ALGORITHM
        )

    @staticmethod
    def verify_token(token: str, token_type: str = "access") -> Optional[dict]:
        """Verify a token and return its payload"""
        try:
            payload = jwt.decode(
                token,
                SecurityConfig.SECRET_KEY,
                algorithms=[SecurityConfig.ALGORITHM]
            )

            if payload.get("type") != token_type:
                return None
                
            return payload
        except JWTError:
            return None
        
    @staticmethod
    def hash_password(password: str) -> str:
        """Hash a password"""
        return SecurityConfig.PWD_CONTEXT.hash(password)

    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        """Verify a password against its hash"""
        return SecurityConfig.PWD_CONTEXT.verify(plain_password, hashed_password)