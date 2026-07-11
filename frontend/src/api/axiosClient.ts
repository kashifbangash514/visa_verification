import axios from 'axios';
import { clearToken, getToken } from '../auth/token';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '',
});

apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginRequest = typeof error.config?.url === 'string' && error.config.url.includes('/auth/login');

    if (error.response?.status === 401 && !isLoginRequest) {
      clearToken();
      if (!window.location.pathname.startsWith('/admin/login')) {
        window.location.href = '/admin/login';
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
