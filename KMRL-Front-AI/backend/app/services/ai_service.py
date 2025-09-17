from transformers import pipeline, AutoTokenizer, AutoModel
from typing import Tuple
import torch

class AIService:
    def __init__(self):
        self.summarizer = None
        self.chat_model = None
        self._load_models()
    
    def _load_models(self):
        """Load AI models on initialization"""
        try:
            # Load summarization model (lightweight for prototype)
            self.summarizer = pipeline(
                "summarization",
                model="facebook/bart-large-cnn",
                device=0 if torch.cuda.is_available() else -1
            )
            print("AI models loaded successfully")
        except Exception as e:
            print(f"Error loading AI models: {e}")
            self.summarizer = None
    
    def summarize_text(self, text: str, max_length: int = 150) -> Tuple[str, float]:
        """Generate summary of input text"""
        try:
            if not self.summarizer:
                return "AI summarization service not available", 0.0
            
            # Truncate text if too long (BART has token limits)
            if len(text) > 1000:
                text = text[:1000] + "..."
            
            # Generate summary
            summary = self.summarizer(
                text,
                max_length=max_length,
                min_length=30,
                do_sample=False
            )
            
            summary_text = summary[0]['summary_text']
            confidence = 0.85  # Placeholder confidence score
            
            return summary_text, confidence
            
        except Exception as e:
            print(f"Summarization error: {e}")
            return f"Error generating summary: {str(e)}", 0.0
    
    def chat_response(self, message: str, context: str = None) -> Tuple[str, float]:
        """Generate chatbot response"""
        try:
            # Simple rule-based responses for prototype
            message_lower = message.lower()
            
            if "hello" in message_lower or "hi" in message_lower:
                return "Hello! I'm your KMRL DocHub AI assistant. How can I help you with document management today?", 0.9
            
            elif "search" in message_lower or "find" in message_lower:
                return "I can help you search through documents. Try using the search feature with keywords related to what you're looking for.", 0.8
            
            elif "upload" in message_lower:
                return "To upload documents, use the upload section. I can process PDFs, images, and text files with OCR and AI analysis.", 0.9
            
            elif "summary" in message_lower or "summarize" in message_lower:
                return "I can generate summaries of your documents automatically. Just upload a document and I'll create a concise summary for you.", 0.9
            
            elif "help" in message_lower:
                return "I can help you with: document upload, text extraction, summarization, search, and navigation. What would you like to know more about?", 0.95
            
            else:
                return "I understand you're asking about document management. Could you be more specific about what you need help with?", 0.6
                
        except Exception as e:
            return f"Sorry, I encountered an error: {str(e)}", 0.0
    
    def extract_entities(self, text: str) -> list:
        """Extract named entities from text"""
        # Placeholder for NER functionality
        return [
            {"text": "KMRL", "label": "ORG", "start": 0, "end": 4},
            {"text": "Kochi", "label": "LOC", "start": 10, "end": 15}
        ]
    
    def classify_document(self, text: str) -> dict:
        """Classify document type and priority"""
        text_lower = text.lower()
        
        # Simple keyword-based classification
        if any(word in text_lower for word in ["safety", "accident", "emergency"]):
            return {"type": "safety", "priority": "high"}
        elif any(word in text_lower for word in ["compliance", "audit", "regulation"]):
            return {"type": "compliance", "priority": "medium"}
        elif any(word in text_lower for word in ["maintenance", "repair", "technical"]):
            return {"type": "operational", "priority": "medium"}
        elif any(word in text_lower for word in ["budget", "finance", "cost"]):
            return {"type": "financial", "priority": "low"}
        else:
            return {"type": "general", "priority": "low"}