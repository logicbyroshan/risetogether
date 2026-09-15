import axios, { AxiosError } from 'axios';

// Get CSRF cookie value helper
function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
}

export const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
  },
});

// Request interceptor to attach CSRF token header
api.interceptors.request.use(async (config) => {
  const method = config.method?.toLowerCase();
  if (method && ['post', 'put', 'patch', 'delete'].includes(method)) {
    let csrfToken = getCookie('csrftoken');
    if (!csrfToken) {
      try {
        const res = await axios.get('/api/auth/csrf/', { withCredentials: true });
        csrfToken = res.data?.csrfToken || getCookie('csrftoken');
      } catch (err) {
        console.warn('Could not fetch CSRF token:', err);
      }
    }
    if (csrfToken) {
      config.headers['X-CSRFToken'] = csrfToken;
    }
  }
  return config;
}, (error) => Promise.reject(error));

// Response interceptor for consistent error extraction
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; errors?: any }>) => {
    const errorMsg = error.response?.data?.message || 
                     (error.response?.data as any)?.error || 
                     error.message || 
                     'An unexpected error occurred';
    return Promise.reject({
      ...error,
      customMessage: errorMsg,
      errors: error.response?.data?.errors,
    });
  }
);
