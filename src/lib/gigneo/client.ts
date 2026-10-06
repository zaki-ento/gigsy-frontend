const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost/gigneo/wp-json/gn/v1";

export async function fetchGigneo<T>(endpoint: string, options?: RequestInit): Promise<T> {
  // We can attach auth tokens here if needed
  const token = typeof window !== 'undefined' ? localStorage.getItem('gigneo_token') : null;
  
  const headers = new Headers(options?.headers);
  headers.set('Content-Type', 'application/json');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'API request failed');
  }

  return response.json();
}
