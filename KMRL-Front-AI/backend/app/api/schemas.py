from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

# User schemas
class UserBase(BaseModel):
    email: str
    name: str
    role: Optional[str] = "user"
    department: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class User(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

# Document schemas
class DocumentBase(BaseModel):
    title: Optional[str] = None
    document_type: Optional[str] = None
    priority: Optional[str] = "medium"
    department: Optional[str] = None

class DocumentCreate(DocumentBase):
    pass

class Document(DocumentBase):
    id: int
    filename: str
    original_filename: str
    file_size: int
    mime_type: str
    extracted_text: Optional[str] = None
    language: str
    processing_status: str
    ocr_confidence: Optional[float] = None
    uploaded_by: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class DocumentSummary(BaseModel):
    id: int
    document_id: int
    summary_text: str
    summary_type: str
    language: str
    confidence_score: Optional[float] = None
    created_at: datetime
    
    class Config:
        from_attributes = True

# Search schemas
class SearchQuery(BaseModel):
    query: str
    filters: Optional[dict] = None
    limit: Optional[int] = 10

class SearchResult(BaseModel):
    documents: List[Document]
    total: int
    query: str

# AI schemas
class ChatMessage(BaseModel):
    message: str
    context: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    confidence: Optional[float] = None