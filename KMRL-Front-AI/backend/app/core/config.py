from pydantic_settings import BaseSettings
from typing import Optional
import os

class Settings(BaseSettings):
    # Database
    database_url: str = "sqlite:///./data/kmrl.db"
    
    # Redis
    redis_url: str = "redis://localhost:6379"
    
    # Neo4j
    neo4j_url: str = "bolt://localhost:7687"
    neo4j_user: str = "neo4j"
    neo4j_password: str = "password"
    
    # JWT
    secret_key: str = "kmrl-dochub-secret-key-change-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # File Storage
    upload_dir: str = "./data/uploads"
    max_file_size: int = 104857600  # 100MB
    
    # AI Models
    huggingface_cache_dir: str = "./data/models"
    faiss_index_path: str = "./data/faiss_index"
    
    # OCR
    tesseract_cmd: str = "tesseract"
    
    class Config:
        env_file = ".env"

# Create data directories
def create_directories():
    dirs = [
        "./data",
        "./data/uploads", 
        "./data/models",
        "./data/neo4j",
        "./data/redis"
    ]
    for dir_path in dirs:
        os.makedirs(dir_path, exist_ok=True)

settings = Settings()
create_directories()