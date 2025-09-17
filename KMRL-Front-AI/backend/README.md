# KMRL DocHub Backend

## Overview
KMRL DocHub Lite backend - A cost-free, intelligent document management prototype for Kochi Metro Rail Limited.

## Features
- **Document Upload & OCR**: Multi-format support with Tesseract OCR
- **AI Summarization**: Automatic document summarization using Transformers
- **Semantic Search**: FAISS-powered vector search
- **Knowledge Graph**: Neo4j-based relationship mapping
- **JWT Authentication**: Secure user authentication
- **RESTful API**: FastAPI-based endpoints

## Quick Start

### Prerequisites
- Python 3.11+
- Docker & Docker Compose
- Git

### Installation

1. **Clone and setup**
```bash
cd backend
cp .env.example .env
```

2. **Using Docker Compose (Recommended)**
```bash
docker-compose up --build
```

3. **Manual Setup**
```bash
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### API Endpoints

#### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/profile` - Get user profile

#### Documents
- `POST /api/v1/documents/upload` - Upload document
- `GET /api/v1/documents/{id}` - Get document
- `POST /api/v1/documents/{id}/summarize` - Generate summary
- `POST /api/v1/documents/search` - Search documents

#### AI Services
- `POST /api/v1/ai/chat` - Chat with AI assistant
- `POST /api/v1/ai/analyze-document` - Analyze document

#### Knowledge Graph
- `GET /api/v1/graph/relationships` - Get graph data
- `POST /api/v1/graph/query` - Execute Cypher query

### API Documentation
Visit `http://localhost:8000/docs` for interactive API documentation.

## Architecture

```
backend/
├── app/
│   ├── api/          # API routes
│   ├── core/         # Configuration & database
│   ├── models/       # SQLAlchemy models
│   ├── services/     # Business logic
│   └── main.py       # FastAPI app
├── data/             # Local storage
├── tests/            # Test files
└── docker-compose.yml
```

## Technology Stack
- **FastAPI**: Web framework
- **SQLAlchemy**: ORM with SQLite
- **Neo4j**: Graph database
- **Redis**: Caching & task queue
- **Transformers**: AI models
- **Tesseract**: OCR engine
- **FAISS**: Vector search

## Development

### Running Tests
```bash
pytest tests/
```

### Adding New Features
1. Create models in `app/models/`
2. Add API routes in `app/api/`
3. Implement business logic in `app/services/`
4. Update schemas in `app/api/schemas.py`

## Deployment

### Production Setup
1. Update environment variables
2. Use production database (PostgreSQL)
3. Configure reverse proxy (NGINX)
4. Set up monitoring and logging

### Environment Variables
See `.env.example` for all configuration options.

## Performance Targets (Prototype)
- API Response: < 500ms
- Document Processing: < 60 seconds
- Concurrent Users: 10-20
- Storage: 1GB capacity

## Support
For issues and questions, refer to the main project documentation.