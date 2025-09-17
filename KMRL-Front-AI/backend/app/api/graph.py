from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..core.database import get_db
from ..models.user import User
from ..api.auth import get_current_user
from ..services.graph_service import GraphService

router = APIRouter()

@router.get("/relationships")
async def get_relationships(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        graph_service = GraphService()
        relationships = graph_service.get_all_relationships()
        
        return {
            "nodes": relationships.get("nodes", []),
            "edges": relationships.get("edges", []),
            "total_nodes": len(relationships.get("nodes", [])),
            "total_edges": len(relationships.get("edges", []))
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Graph service error: {str(e)}")

@router.post("/query")
async def query_graph(
    query: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        graph_service = GraphService()
        results = graph_service.execute_query(query.get("cypher", ""))
        
        return {
            "results": results,
            "query": query.get("cypher", ""),
            "execution_time": "< 1ms"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Graph query error: {str(e)}")