from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    """Application settings"""
    
    # Ethereum Configuration
    rpc_url: str
    contract_address: str = "0x5E95A1e4922Eeccc5B76cdFB0c59aad77fCd1d40"
    private_key: Optional[str] = None
    
    # API Configuration
    api_title: str = "Decentralized Voting System API"
    api_version: str = "1.0.0"
    
    # CORS Configuration
    cors_origins: list = ["*"]
    
    class Config:
        env_file = ".env"
        case_sensitive = False

settings = Settings()
