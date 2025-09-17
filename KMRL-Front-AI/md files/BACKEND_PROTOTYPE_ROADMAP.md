# KMRL DocHub Lite Backend Development Roadmap

## Project Overview

KMRL DocHub Lite is a cost-free, intelligent document management and compliance platform prototype designed for Kochi Metro Rail Limited. The backend serves as a lightweight core engine supporting AI-powered document processing, summarization, and basic querying, tailored for hackathon demos (e.g., MeitY or Smart India Hackathon). This roadmap leverages open-source tools and free-tier services, excluding paid APIs and cloud resources, and focuses on a simplified architecture with local deployment.

## Architecture Vision

The backend adopts a modular, single-server architecture with AI capabilities for document intelligence and basic search. It emphasizes local execution, minimal resource use, and rapid prototyping, with services for ingestion, processing, and querying. Green computing is supported via manual resource shutdowns.

## Phase-Based Development Roadmap

### Phase 1: Core Intelligence Engine (MVP) - 4 weeks

**Goal**: Build a functional prototype with essential document processing and search capabilities

#### Week 1-2: Infrastructure Setup
- [ ] Set up local development environment (Python 3.11+, Node.js)
- [ ] Configure containerization with Docker Compose
- [ ] Set up database infrastructure (SQLite for metadata, FAISS for vectors, Neo4j Community Edition for graphs)
- [ ] Implement basic authentication (JWT via PyJWT)
- [ ] Create simple API endpoints with FastAPI

#### Week 3-4: Document Processing Core
- [ ] **Document Upload Service**
  - Multi-format file handling (PDF, DOC, images) via local file system
  - Basic file validation
  - Metadata extraction
  - Auto-deduplication with perceptual hashing
- [ ] **OCR Service Integration**
  - Tesseract OCR for English text
  - PaddleOCR + Akshara for Malayalam text
  - Image preprocessing with OpenCV (deskewing, noise reduction)
- [ ] **Document Storage Service**
  - Local file system storage
  - Basic version control via file naming
  - Manual backup process

### Phase 2: AI Processing Pipeline - 2 weeks

#### Week 5-6: Text Processing & Summarization
- [ ] **Text Processing Service**
  - Language detection with fastText
  - Text cleaning and normalization
  - Entity extraction with spaCy Indic
- [ ] **Summarization Service**
  - mT5 model for multilingual summarization (local inference via Hugging Face Transformers)
  - IndicBERT for Malayalam processing
  - Basic quality scoring
- [ ] **Search Service**
  - Vector embeddings with sentence-transformers
  - Semantic search with FAISS
  - Full-text search with SQLite FTS5

### Phase 3: API Development & Integration - 2 weeks

#### Week 7-8: Core APIs
- [ ] **REST API Development**
  - Document CRUD operations
  - Search and filter endpoints
- [ ] **Real-time Features**
  - Polling-based updates (no WebSocket)
  - Console-based notifications
- [ ] **Frontend Integration**
  - API documentation with FastAPI's auto-generated docs
  - Basic CORS setup

## Technology Stack

### Core Backend Technologies
- **Runtime**: Python 3.11+ with FastAPI
- **Database**: SQLite (metadata), FAISS (vectors), Neo4j Community Edition (graphs)
- **Message Queue**: Celery
- **Search**: SQLite FTS5

### AI/ML Technologies
- **OCR**: Tesseract, PaddleOCR + Akshara, OpenCV
- **NLP**: Hugging Face Transformers (mT5, IndicBERT), spaCy Indic, fastText, sentence-transformers
- **Chatbot**: Rasa Open Source
- **Analytics**: Prophet, pandas

### Infrastructure & DevOps
- **Containerization**: Docker, Docker Compose
- **CI/CD**: Manual testing with GitHub Actions free tier
- **Monitoring**: Basic logging with Python's logging module

### Integration Technologies
- **Workflow**: Celery
- **IoT**: None (manual data input)
- **Blockchain**: None

## AI Model Integration Strategy

### Document Processing Models
1. **OCR Models**
   - Tesseract for English
   - PaddleOCR + Akshara for Malayalam
   - OpenCV for preprocessing
2. **NLP Models**
   - mT5-base for summarization
   - IndicBERT for Malayalam
   - sentence-transformers for embeddings
   - spaCy Indic for NER
3. **Classification Models**
   - Rule-based classification
   - Priority scoring with simple thresholds

### Conversational AI Models
1. **Rasa Framework**
   - Intent classification
   - Entity extraction
   - Dialogue management

### Predictive Models
1. **Time Series Forecasting**
   - Prophet for basic predictions
2. **Anomaly Detection**
   - Manual review of patterns

## API Architecture

### Core API Modules

#### Authentication & Authorization
```
POST /api/v1/auth/login
GET  /api/v1/auth/profile
```

#### Document Management
```
POST /api/v1/documents/upload
GET  /api/v1/documents/{id}
PUT  /api/v1/documents/{id}
DELETE /api/v1/documents/{id}
GET  /api/v1/documents/search
POST /api/v1/documents/{id}/summarize
```

#### AI Services
```
POST /api/v1/ai/chat
POST /api/v1/ai/analyze-document
```

#### Knowledge Graph
```
GET  /api/v1/graph/relationships
POST /api/v1/graph/query
```

## Database Schema Design

### Core Tables
- **users**: Basic authentication data
- **documents**: Metadata and file paths
- **document_versions**: File version logs
- **ai_summaries**: Summaries as text
- **annotations**: Comment logs
- **workflows**: Task status
- **audit_logs**: Simple operation logs

### Graph Database Schema (Neo4j)
- **Nodes**: Document, Person, Department
- **Relationships**: REFERENCES, APPROVES

## Security & Compliance

### Security Measures
- JWT-based authentication
- Basic file permissions
- Manual security checks

### Compliance Features
- Manual audit trail
- Data retention via local backups
- Basic regulatory reporting

## Performance & Scalability

### Performance Targets
- API response time: < 500ms (local)
- Document processing: < 60 seconds
- Search response: < 200ms
- Concurrent users: 10-20
- Document storage: 1GB capacity

### Scalability Strategy
- Single-server operation
- Manual resource scaling

## Monitoring & Observability

### Key Metrics
- API response times
- Document processing success rate
- User actions

### Monitoring Tools
- Python logging
- Manual health checks

## Deployment Strategy

### Development Environment
- Docker Compose for local setup
- Manual testing
- Database seeding via scripts

### Production Deployment
- Local server deployment
- Manual rollback
- Environment config via .env files

## Free Prototype for Hackathon Demo

### Prototype Architecture (Simplified & Free)
- **Backend**: FastAPI on local Python env
- **Databases/Storage**: SQLite, FAISS, Neo4j Community Edition, local file system
- **Frontend**: React.js via Vercel free tier; React Native via Expo
- **AI/ML**: Hugging Face Transformers, Tesseract/paddleOCR, spaCy Indic, Prophet
- **Workflow/Integration**: Celery, ngrok free tunneling
- **Security**: Basic JWT, logging
- **Performance**: Local Redis, demo-scale (100s of docs)

| Prototype Component | Free Tools & Setup | Demo Features Shown |
|---------------------|-------------------|---------------------|
| Ingestion | FastAPI + local uploads/emails via smtplib | Upload sample PDFs |
| Processing | Transformers + Tesseract/paddleOCR | Bilingual summaries, entity extraction |
| Storage | SQLite + FAISS + Neo4j CE | Store/index docs, query graph |
| Routing | Celery tasks | Console/email notifications |
| Frontend | React/Vercel; Expo | Dashboards, live queries |
| DevOps | Docker Compose | One-command setup |

### Prototype Build Roadmap (Hackathon-Ready, 48-72 Hours)
1. **Setup (Hours 1-4)**: Install Python/Docker/Node.js, clone repos
2. **Core Modules (Hours 5-24)**: Build ingestion, OCR, summarization, graph
3. **Integration (Hours 25-36)**: Wire FAISS, add Celery, frontend hooks
4. **Testing/Demo Prep (Hours 37-48)**: Use sample docs, script flows
5. **Polish (Hours 49-72)**: Accessibility tweaks, README, video

## Detailed Implementation Guide

### Docker Compose Setup
```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    volumes:
      - ./data:/app/data
    environment:
      - DATABASE_URL=sqlite:///./data/kmrl.db
  
  neo4j:
    image: neo4j:community
    ports:
      - "7474:7474"
      - "7687:7687"
    environment:
      - NEO4J_AUTH=neo4j/password
    volumes:
      - ./neo4j_data:/data
  
  redis:
    image: redis:alpine
    ports:
      - "6379:6379"
```

### Core Dependencies (requirements.txt)
```
fastapi==0.104.1
uvicorn==0.24.0
sqlalchemy==2.0.23
sqlite-fts4==1.0.3
faiss-cpu==1.7.4
transformers==4.35.2
torch==2.1.1
sentence-transformers==2.2.2
spacy==3.7.2
paddleocr==2.7.0.3
pytesseract==0.3.10
opencv-python==4.8.1.78
celery==5.3.4
redis==5.0.1
neo4j==5.14.1
rasa==3.6.13
prophet==1.1.5
pandas==2.1.3
numpy==1.25.2
python-multipart==0.0.6
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
```

### Sample API Implementation
```python
from fastapi import FastAPI, UploadFile, File
from sqlalchemy import create_engine
import sqlite3
import faiss
import numpy as np
from transformers import pipeline

app = FastAPI()

# Initialize AI models
summarizer = pipeline("summarization", model="facebook/mbart-large-50-many-to-many-mmt")
embedder = pipeline("feature-extraction", model="sentence-transformers/all-MiniLM-L6-v2")

@app.post("/api/v1/documents/upload")
async def upload_document(file: UploadFile = File(...)):
    # Save file locally
    content = await file.read()
    # Process with OCR
    # Generate embeddings
    # Store in SQLite + FAISS
    return {"status": "success", "document_id": "doc_123"}

@app.post("/api/v1/documents/{doc_id}/summarize")
async def summarize_document(doc_id: str):
    # Retrieve document text
    # Generate summary with mT5
    # Store summary
    return {"summary": "Generated summary text"}

@app.get("/api/v1/documents/search")
async def search_documents(query: str):
    # Generate query embedding
    # Search FAISS index
    # Return ranked results
    return {"results": []}
```

## Risk Mitigation

### Technical Risks
- **AI Model Performance**: Manual retraining with sample data
- **Data Privacy**: Local encryption and access controls
- **System Downtime**: Backup server configuration
- **Integration Failures**: Fallback to manual processes

### Business Risks
- **User Adoption**: Comprehensive demo training
- **Compliance Changes**: Flexible workflow configuration
- **Scalability Issues**: Limit concurrent user base
- **Data Loss**: Regular manual backups

## Success Metrics

### Technical KPIs
- 99% uptime (local environment)
- < 500ms average API response time
- 90%+ AI model accuracy
- Zero data loss incidents

### Business KPIs
- 70%+ demo engagement rate
- 50% reduction in document processing time
- 80% compliance score maintenance
- 60% reduction in manual routing tasks

## Next Steps

1. **Environment Setup**: Install required software and dependencies
2. **Core Development**: Build MVP features in 8 weeks
3. **Testing**: Validate with sample KMRL documents
4. **Demo Preparation**: Create presentation materials and video walkthrough
5. **Documentation**: Complete technical and user documentation
6. **Hackathon Submission**: Package for competition submission

This prototype roadmap provides a practical foundation for building a cost-effective, functional demonstration of KMRL DocHub's core capabilities using entirely free and open-source technologies.