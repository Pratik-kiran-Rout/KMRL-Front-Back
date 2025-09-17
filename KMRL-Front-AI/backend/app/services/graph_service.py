from neo4j import GraphDatabase
from typing import Dict, List
from ..core.config import settings

class GraphService:
    def __init__(self):
        self.driver = None
        self._connect()
    
    def _connect(self):
        """Connect to Neo4j database"""
        try:
            self.driver = GraphDatabase.driver(
                settings.neo4j_url,
                auth=(settings.neo4j_user, settings.neo4j_password)
            )
            print("Connected to Neo4j")
        except Exception as e:
            print(f"Neo4j connection error: {e}")
            self.driver = None
    
    def close(self):
        """Close Neo4j connection"""
        if self.driver:
            self.driver.close()
    
    def create_document_node(self, document_id: int, title: str, doc_type: str, department: str):
        """Create a document node in the graph"""
        if not self.driver:
            return False
        
        with self.driver.session() as session:
            try:
                session.run(
                    """
                    CREATE (d:Document {
                        id: $doc_id,
                        title: $title,
                        type: $doc_type,
                        department: $department,
                        created_at: datetime()
                    })
                    """,
                    doc_id=document_id,
                    title=title,
                    doc_type=doc_type,
                    department=department
                )
                return True
            except Exception as e:
                print(f"Error creating document node: {e}")
                return False
    
    def create_user_node(self, user_id: int, name: str, role: str, department: str):
        """Create a user node in the graph"""
        if not self.driver:
            return False
        
        with self.driver.session() as session:
            try:
                session.run(
                    """
                    MERGE (u:User {id: $user_id})
                    SET u.name = $name,
                        u.role = $role,
                        u.department = $department,
                        u.updated_at = datetime()
                    """,
                    user_id=user_id,
                    name=name,
                    role=role,
                    department=department
                )
                return True
            except Exception as e:
                print(f"Error creating user node: {e}")
                return False
    
    def create_relationship(self, from_id: int, to_id: int, relationship_type: str, from_type: str = "User", to_type: str = "Document"):
        """Create relationship between nodes"""
        if not self.driver:
            return False
        
        with self.driver.session() as session:
            try:
                session.run(
                    f"""
                    MATCH (a:{from_type} {{id: $from_id}})
                    MATCH (b:{to_type} {{id: $to_id}})
                    CREATE (a)-[r:{relationship_type} {{created_at: datetime()}}]->(b)
                    """,
                    from_id=from_id,
                    to_id=to_id
                )
                return True
            except Exception as e:
                print(f"Error creating relationship: {e}")
                return False
    
    def get_all_relationships(self) -> Dict:
        """Get all nodes and relationships for visualization"""
        if not self.driver:
            return {"nodes": [], "edges": []}
        
        with self.driver.session() as session:
            try:
                # Get nodes
                nodes_result = session.run(
                    """
                    MATCH (n)
                    RETURN n, labels(n) as labels
                    """
                )
                
                nodes = []
                for record in nodes_result:
                    node = record["n"]
                    labels = record["labels"]
                    nodes.append({
                        "id": node.get("id", "unknown"),
                        "label": node.get("name", node.get("title", "Unknown")),
                        "type": labels[0] if labels else "Unknown",
                        "properties": dict(node)
                    })
                
                # Get relationships
                edges_result = session.run(
                    """
                    MATCH (a)-[r]->(b)
                    RETURN a.id as source, b.id as target, type(r) as relationship
                    """
                )
                
                edges = []
                for record in edges_result:
                    edges.append({
                        "source": record["source"],
                        "target": record["target"],
                        "relationship": record["relationship"]
                    })
                
                return {"nodes": nodes, "edges": edges}
                
            except Exception as e:
                print(f"Error getting relationships: {e}")
                return {"nodes": [], "edges": []}
    
    def execute_query(self, cypher_query: str) -> List[Dict]:
        """Execute custom Cypher query"""
        if not self.driver or not cypher_query:
            return []
        
        with self.driver.session() as session:
            try:
                result = session.run(cypher_query)
                return [dict(record) for record in result]
            except Exception as e:
                print(f"Error executing query: {e}")
                return []
    
    def find_related_documents(self, document_id: int) -> List[Dict]:
        """Find documents related to a given document"""
        if not self.driver:
            return []
        
        with self.driver.session() as session:
            try:
                result = session.run(
                    """
                    MATCH (d:Document {id: $doc_id})-[r]-(related:Document)
                    RETURN related, type(r) as relationship
                    """,
                    doc_id=document_id
                )
                
                related_docs = []
                for record in result:
                    doc = record["related"]
                    relationship = record["relationship"]
                    related_docs.append({
                        "document": dict(doc),
                        "relationship": relationship
                    })
                
                return related_docs
                
            except Exception as e:
                print(f"Error finding related documents: {e}")
                return []