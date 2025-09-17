from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from .core.config import settings
from .core.database import init_db
from .api import auth, documents, ai, graph

# Initialize database
init_db()

# Create FastAPI app
app = FastAPI(
    title="KMRL DocHub API",
    description="Intelligent Document Management Platform for Kochi Metro Rail Limited",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:8080", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files
if os.path.exists(settings.upload_dir):
    app.mount("/uploads", StaticFiles(directory=settings.upload_dir), name="uploads")

# Include routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["authentication"])
app.include_router(documents.router, prefix="/api/v1/documents", tags=["documents"])
app.include_router(ai.router, prefix="/api/v1/ai", tags=["ai"])
app.include_router(graph.router, prefix="/api/v1/graph", tags=["knowledge-graph"])

@app.get("/")
async def root():
    return {
        "message": "KMRL DocHub API",
        "version": "1.0.0",
        "status": "operational"
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "database": "connected",
        "services": {
            "ocr": "available",
            "ai": "available",
            "search": "available"
        }
    }

@app.get("/test")
async def test_endpoint():
    print("TEST ENDPOINT CALLED!")
    return {"message": "Backend is working!"}