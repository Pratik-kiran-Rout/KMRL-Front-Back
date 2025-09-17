const API_BASE_URL = 'http://localhost:8000/api/v1';

export const uploadDocument = async (file: File, title?: string, documentType?: string, department?: string) => {
  const formData = new FormData();
  formData.append('file', file);
  if (title) formData.append('title', title);
  if (documentType) formData.append('document_type', documentType);
  if (department) formData.append('department', department);

  const token = localStorage.getItem('token');
  console.log('Upload token:', token ? 'exists' : 'missing');
  
  if (!token) {
    throw new Error('No authentication token found');
  }
  
  const response = await fetch(`${API_BASE_URL}/documents/upload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Upload failed:', response.status, errorText);
    throw new Error(`Upload failed: ${response.status}`);
  }

  return response.json();
};

export const getDocuments = async () => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_BASE_URL}/documents/`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch documents');
  }

  return response.json();
};

export const getSummary = async (documentId: number) => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_BASE_URL}/documents/${documentId}/summarize`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to generate summary');
  }

  return response.json();
};