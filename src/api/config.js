import axios from 'axios';
import Cookies from 'js-cookie';

// Base URL cho API
const API_BASE_URL = 'https://apilive.loltips.net/api/v1';

// Tạo axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    accept: 'application/json',
    'Content-Type': 'application/json'
  }
});

// Interceptor để thêm token vào header
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor để xử lý refresh token
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = Cookies.get('refreshToken');
        if (refreshToken) {
          // Import refreshTokenAPI để tránh circular dependency
          const { refreshTokenAPI } = await import('./auth');
          const newToken = await refreshTokenAPI(refreshToken);
          Cookies.set('token', newToken, { expires: 7, path: '/', sameSite: 'Lax' });

          // Retry original request với token mới
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh token failed, redirect to login
        Cookies.remove('token');
        Cookies.remove('refreshToken');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
export { API_BASE_URL }; 