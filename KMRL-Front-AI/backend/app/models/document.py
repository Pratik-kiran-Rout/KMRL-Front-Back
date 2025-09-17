from sqlalchemy import Column, Integer, String, DateTime, Text, Float, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..core.database import Base

class Document(Base):
    __tablename__ = "documents"
    
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, nullable=False)
    original_filename = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    file_size = Column(Integer, nullable=False)
    mime_type = Column(String, nullable=False)
    
    # Content
    extracted_text = Column(Text, nullable=True)
    language = Column(String, default="en")
    
    # Metadata
    title = Column(String, nullable=True)
    document_type = Column(String, nullable=True)  # safety, compliance, operational, financial
    priority = Column(String, default="medium")  # low, medium, high, critical
    department = Column(String, nullable=True)
    
    # Processing status
    processing_status = Column(String, default="pending")  # pending, processing, completed, failed
    ocr_confidence = Column(Float, nullable=True)
    
    # Relationships
    uploaded_by = Column(Integer, ForeignKey("users.id"))
    uploader = relationship("User")
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class DocumentSummary(Base):
    __tablename__ = "document_summaries"
    
    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.id"))
    summary_text = Column(Text, nullable=False)
    summary_type = Column(String, default="extractive")  # extractive, abstractive
    language = Column(String, default="en")
    confidence_score = Column(Float, nullable=True)
    
    # Relationship
    document = relationship("Document")
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())