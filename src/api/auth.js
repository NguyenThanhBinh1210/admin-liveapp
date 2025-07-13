import api from './config';
import Cookies from 'js-cookie';

// ============================|| AUTHENTICATION API ||============================ //

/**
 * Login API
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise} Response data
 */
export const loginAPI = async (email, password) => {
  try {
    const response = await api.post('/auth/login', {
      email,
      password
    });
    const res = response.data;

    // Lưu tokens vào cookies sử dụng js-cookie
    if (res.data.accessToken) {
      const token = res.data.accessToken;
      Cookies.set('token', token, {
        expires: 7, // 7 ngày
        path: '/', // Toàn site
        sameSite: 'Lax', // Bảo mật CSRF
        secure: false // HTTP/HTTPS (set true cho production HTTPS)
      });
    }

    if (res.data.refreshToken) {
      const refreshToken = res.data.refreshToken;
      Cookies.set('refreshToken', refreshToken, {
        expires: 30, // 30 ngày
        path: '/',
        sameSite: 'Lax',
        secure: false
      });
    }

    return res.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || 'Login failed',
      status: error.response?.status,
      data: error.response?.data
    };
  }
};

/**
 * Refresh Token API
 * @param {string} refreshToken - Refresh token
 * @returns {Promise<string>} New access token
 */
export const refreshTokenAPI = async (refreshToken) => {
  try {
    const response = await api.post('/auth/refresh-token', {
      refreshToken
    });

    const newToken = response.data.token || response.data.access_token;
    if (newToken) {
      Cookies.set('token', newToken, { expires: 7, path: '/', sameSite: 'Lax' });
    }

    // Cập nhật refresh token mới nếu có
    if (response.data.refreshToken || response.data.refresh_token) {
      Cookies.set('refreshToken', response.data.refreshToken || response.data.refresh_token, {
        expires: 30,
        path: '/',
        sameSite: 'Lax'
      });
    }

    return newToken;
  } catch (error) {
    throw {
      message: error.response?.data?.message || 'Refresh token failed',
      status: error.response?.status,
      data: error.response?.data
    };
  }
};

/**
 * Logout API (clear cookies)
 */
export const logoutAPI = () => {
  Cookies.remove('token');
  Cookies.remove('refreshToken');
};

/**
 * Check if user is authenticated
 * @returns {boolean}
 */
export const isAuthenticated = () => {
  const token = Cookies.get('token');
  return !!token;
};

/**
 * Get current token
 * @returns {string|undefined}
 */
export const getToken = () => {
  return Cookies.get('token');
};

/**
 * Get current refresh token
 * @returns {string|undefined}
 */
export const getRefreshToken = () => {
  return Cookies.get('refreshToken');
};

/**
 * Redirect to login if not authenticated
 * @param {string} returnUrl - URL to return to after login
 */
export const requireAuth = (returnUrl) => {
  if (!isAuthenticated()) {
    const url = returnUrl || window.location.pathname + window.location.search;
    window.location.href = `/login?returnUrl=${encodeURIComponent(url)}`;
    return false;
  }
  return true;
};

/**
 * Get User Profile API
 * @returns {Promise} User profile data
 */
export const getUserProfileAPI = async () => {
  try {
    const response = await api.get('/auth/profile');
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || 'Failed to get user profile',
      status: error.response?.status,
      data: error.response?.data
    };
  }
};
