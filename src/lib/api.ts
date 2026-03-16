import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  withCredentials: true, // Crucial for httpOnly cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor to handle authentication errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const requestUrl: string = error.config?.url || '';
      const isAuthRoute = requestUrl.includes('/auth/');
      const isOnLoginPage = typeof window !== 'undefined' && window.location.pathname === '/login';

      // Only redirect to login if it's not an auth route and we're not already there
      if (typeof window !== 'undefined' && !isAuthRoute && !isOnLoginPage) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
