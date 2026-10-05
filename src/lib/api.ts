const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8888/gigsy/wp-json/gn/v1';

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  // Get token from localStorage if in the browser
  let token = null;
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('gigneo_jwt_token');
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };

  // If token exists, attach it to Authorization header
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Remove Content-Type if sending FormData (browser sets it automatically with boundaries)
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMsg = 'An error occurred';
    try {
      const errorData = await response.json();
      errorMsg = errorData.message || errorMsg;
    } catch (e) {
      // Ignore JSON parse errors for 500s
    }
    throw new Error(errorMsg);
  }

  return response.json();
}
