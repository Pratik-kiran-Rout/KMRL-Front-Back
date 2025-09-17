import pytesseract
import cv2
import numpy as np
from PIL import Image
import os
from typing import Tuple

class OCRService:
    def __init__(self):
        # Configure tesseract path if needed
        # pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
        pass
    
    def preprocess_image(self, image_path: str) -> np.ndarray:
        """Preprocess image for better OCR results"""
        image = cv2.imread(image_path)
        
        # Convert to grayscale
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        
        # Apply denoising
        denoised = cv2.fastNlMeansDenoising(gray)
        
        # Apply threshold to get binary image
        _, thresh = cv2.threshold(denoised, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        
        return thresh
    
    def extract_text(self, file_path: str) -> Tuple[str, float]:
        """Extract text from document using OCR"""
        try:
            file_extension = os.path.splitext(file_path)[1].lower()
            
            if file_extension in ['.jpg', '.jpeg', '.png', '.tiff', '.bmp']:
                # Image file - use OCR
                processed_image = self.preprocess_image(file_path)
                
                # Get OCR data with confidence
                ocr_data = pytesseract.image_to_data(processed_image, output_type=pytesseract.Output.DICT)
                
                # Extract text and calculate average confidence
                text_parts = []
                confidences = []
                
                for i, conf in enumerate(ocr_data['conf']):
                    if int(conf) > 0:  # Only include confident detections
                        text = ocr_data['text'][i].strip()
                        if text:
                            text_parts.append(text)
                            confidences.append(int(conf))
                
                extracted_text = ' '.join(text_parts)
                avg_confidence = sum(confidences) / len(confidences) if confidences else 0
                
                return extracted_text, avg_confidence / 100.0  # Convert to 0-1 scale
                
            elif file_extension == '.pdf':
                # For PDF files, we'd need additional libraries like PyPDF2 or pdfplumber
                # For now, return placeholder
                return "PDF text extraction not implemented yet", 0.0
                
            else:
                # Try to read as text file
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                return content, 1.0
                
        except Exception as e:
            print(f"OCR Error: {str(e)}")
            return f"Error extracting text: {str(e)}", 0.0
    
    def detect_language(self, text: str) -> str:
        """Detect language of extracted text"""
        # Simple heuristic - check for Malayalam characters
        malayalam_chars = any('\u0d00' <= char <= '\u0d7f' for char in text)
        hindi_chars = any('\u0900' <= char <= '\u097f' for char in text)
        
        if malayalam_chars:
            return "ml"
        elif hindi_chars:
            return "hi"
        else:
            return "en"