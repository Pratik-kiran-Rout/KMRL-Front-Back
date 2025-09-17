from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
import os
import uuid
import shutil

from ..core.database import get_db
from ..models.user import User
from ..models.document import Document, DocumentSummary
from ..api.schemas import Document as DocumentSchema, DocumentSummary as DocumentSummarySchema, SearchQuery, SearchResult
from ..api.auth import get_current_user
from ..services.ocr_service import OCRService
from ..services.ai_service import AIService
from ..core.config import settings

router = APIRouter()

@router.post("/upload", response_model=DocumentSchema)
async def upload_document(
    file: UploadFile = File(...),
    title: Optional[str] = Form(None),
    document_type: Optional[str] = Form(None),
    department: Optional[str] = Form(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Validate file size
    if file.size > settings.max_file_size:
        raise HTTPException(status_code=413, detail="File too large")
    
    # Generate unique filename
    file_extension = os.path.splitext(file.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(settings.upload_dir, unique_filename)
    
    # Save file
    os.makedirs(settings.upload_dir, exist_ok=True)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Create document record
    document = Document(
        filename=unique_filename,
        original_filename=file.filename,
        file_path=file_path,
        file_size=file.size,
        mime_type=file.content_type,
        title=title or file.filename,
        document_type=document_type,
        department=department or current_user.department,
        uploaded_by=current_user.id,
        processing_status="pending"
    )
    
    db.add(document)
    db.commit()
    db.refresh(document)
    
    # Trigger OCR processing (async in production)
    try:
        ocr_service = OCRService()
        extracted_text, confidence = ocr_service.extract_text(file_path)
        
        document.extracted_text = extracted_text
        document.ocr_confidence = confidence
        document.processing_status = "completed"
        
        db.commit()
        db.refresh(document)
    except Exception as e:
        document.processing_status = "failed"
        db.commit()
    
    return document

@router.get("/{document_id}", response_model=DocumentSchema)
async def get_document(
    document_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    document = db.query(Document).filter(Document.id == document_id).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    return document

@router.get("/", response_model=List[DocumentSchema])
async def list_documents(
    skip: int = 0,
    limit: int = 10,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    documents = db.query(Document).offset(skip).limit(limit).all()
    return documents

@router.post("/{document_id}/summarize", response_model=DocumentSummarySchema)
async def summarize_document(
    document_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    document = db.query(Document).filter(Document.id == document_id).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    if not document.extracted_text:
        raise HTTPException(status_code=400, detail="Document text not available")
    
    # Check if summary already exists
    existing_summary = db.query(DocumentSummary).filter(
        DocumentSummary.document_id == document_id
    ).first()
    
    if existing_summary:
        return existing_summary
    
    # Generate summary
    ai_service = AIService()
    summary_text, confidence = ai_service.summarize_text(document.extracted_text)
    
    # Save summary
    summary = DocumentSummary(
        document_id=document_id,
        summary_text=summary_text,
        summary_type="abstractive",
        language=document.language,
        confidence_score=confidence
    )
    
    db.add(summary)
    db.commit()
    db.refresh(summary)
    
    return summary

@router.post("/search", response_model=SearchResult)
async def search_documents(
    query: SearchQuery,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Simple text search for now
    documents = db.query(Document).filter(
        Document.extracted_text.contains(query.query)
    ).limit(query.limit).all()
    
    return SearchResult(
        documents=documents,
        total=len(documents),
        query=query.query
    )