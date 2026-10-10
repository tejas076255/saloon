from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "SalonDesk Premium SaaS"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    SECRET_KEY: str = "salondesk-ultra-secure-saas-secret-key-change-in-production-2026"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    DATABASE_URL: str = "sqlite:///./salondesk.db"
    
    # Cloudflare Stack Integration
    CLOUDFLARE_ACCOUNT_ID: str = "0ff0c6c2f6108c0e9bc82c0baa186d05"
    CLOUDFLARE_D1_DATABASE_ID: str = "9f1d67a2-13d8-424e-98e1-26d277bc05ef"
    CLOUDFLARE_API_KEY: str = ""
    CLOUDFLARE_EMAIL: str = "tejasgogavale5@gmail.com"
    
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "*"
    ]
    
    DEV_MODE_PAYMENTS: bool = True

    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True, extra="ignore")


settings = Settings()
