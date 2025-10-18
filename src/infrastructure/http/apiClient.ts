import axios from 'axios';

// Vite injects import.meta.env at build time
const env = (import.meta as unknown as { env?: Record<string, string> }).env ?? {};
// Default to same-origin '/api' so Vite dev proxy can forward to backend and avoid CORS in dev
const baseURL = env.VITE_API_URL ?? '/api';
const withCreds = (env.VITE_WITH_CREDENTIALS ?? 'false').toLowerCase() === 'true';

export const apiClient = axios.create({
  baseURL,
  withCredentials: withCreds,
});

// Attach Authorization header from localStorage if present
try {
  const token = localStorage.getItem('nordic-auth-token');
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
} catch {
  // ignore SSR/localStorage unavailability
}

// Basic response interceptor to handle unauthorized globally
apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      try {
        localStorage.removeItem('nordic-auth-token');
        localStorage.removeItem('nordic-admin-user');
      } catch {
        // ignore
      }
      delete apiClient.defaults.headers.common['Authorization'];
    }
    return Promise.reject(err);
  }
);
