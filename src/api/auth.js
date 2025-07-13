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

// ============================|| AUTH API FUNCTIONS ||============================ //

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

/**
 * Get Users List API (Admin only)
 * @param {Object} params - Query parameters
 * @param {string} params.email - Email filter
 * @param {number} params.page - Page number
 * @param {number} params.limit - Items per page
 * @param {string} params.role - Role filter
 * @returns {Promise} Users list data
 */
export const getUsersAPI = async (params = {}) => {
  try {
    const response = await api.get('/admin/users', { params });
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || 'Failed to get users list',
      status: error.response?.status,
      data: error.response?.data
    };
  }
};

/**
 * Update User Role API (Admin only)
 * @param {string} userId - User ID
 * @param {string} role - New role
 * @returns {Promise} Update result
 */
export const updateUserRoleAPI = async (userId, role) => {
  try {
    const response = await api.patch(`/admin/users/${userId}/role`, { role });
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || 'Failed to update user role',
      status: error.response?.status,
      data: error.response?.data
    };
  }
};

/**
 * Get Top-up Requests API (Admin only)
 * @param {Object} params - Query parameters
 * @param {string} params.userId - User ID filter
 * @param {string} params.status - Status filter
 * @param {number} params.page - Page number
 * @param {number} params.limit - Items per page
 * @returns {Promise} Top-up requests data
 */
export const getTopupRequestsAPI = async (params = {}) => {
  try {
    const response = await api.get('/admin/topup-requests', { params });
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || 'Failed to get topup requests',
      status: error.response?.status,
      data: error.response?.data
    };
  }
};

/**
 * Update Topup Request Status API (Admin only)
 * @param {string} userId - User ID
 * @param {string} status - New status
 * @returns {Promise} Update result
 */
export const updateTopupRequestStatusAPI = async (userId, status, adminNote) => {
  try {
    const response = await api.patch(`/wallet/topup/${userId}/status`, {
      status,
      adminNote
    });
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || 'Failed to update topup request status',
      status: error.response?.status,
      data: error.response?.data
    };
  }
};

/**
 * Get Withdraw Requests API (Admin only)
 * @param {Object} params - Query parameters
 * @param {string} params.userId - User ID filter
 * @param {string} params.status - Status filter
 * @param {number} params.page - Page number
 * @param {number} params.limit - Items per page
 * @returns {Promise} Withdraw requests data
 */
export const getWithdrawRequestsAPI = async (params = {}) => {
  try {
    const response = await api.get('/admin/withdraw-requests', { params });
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || 'Failed to get withdraw requests',
      status: error.response?.status,
      data: error.response?.data
    };
  }
};

/**
 * Update Withdraw Request Status API (Admin only)
 * @param {string} userId - User ID
 * @param {string} status - New status
 * @returns {Promise} Update result
 */
export const updateWithdrawRequestStatusAPI = async (userId, status, adminNote) => {
  try {
    const response = await api.patch(`/wallet/withdraw/${userId}/status`, {
      status,
      adminNote
    });
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || 'Failed to update withdraw request status',
      status: error.response?.status,
      data: error.response?.data
    };
  }
};

/**
 * Get Gifts API (Admin only)
 * @param {Object} params - Query parameters
 * @param {boolean} params.isActive - Active status filter
 * @param {number} params.page - Page number
 * @param {number} params.limit - Items per page
 * @returns {Promise} Gifts data
 */
export const getGiftsAPI = async (params = {}) => {
  try {
    const response = await api.get('/admin/gifts', { params });
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || 'Failed to get gifts',
      status: error.response?.status,
      data: error.response?.data
    };
  }
};

/**
 * Get Config API (Admin only)
 * @returns {Promise} Config data
 */
export const getConfigAPI = async () => {
  try {
    const response = await api.get('/admin/config');
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || 'Failed to get config',
      status: error.response?.status,
      data: error.response?.data
    };
  }
};

/**
 * Update Config API (Admin only)
 * @param {Object} configData - Configuration data to update
 * @param {number} configData.minTopup - Minimum topup amount
 * @param {number} configData.maxWithdraw - Maximum withdraw amount
 * @param {number} configData.commissionRate - Commission rate percentage
 * @param {number} configData.giftBonusRate - Gift bonus rate percentage
 * @returns {Promise} Updated config data
 */
export const updateConfigAPI = async (configData) => {
  try {
    const response = await api.patch('/admin/config', configData);
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || 'Failed to update config',
      status: error.response?.status,
      data: error.response?.data
    };
  }
};

/**
 * Get Dashboard Stats API (Admin only)
 * @returns {Promise} Dashboard statistics data
 */
export const getDashboardStatsAPI = async () => {
  try {
    const response = await api.get('/admin/dashboard');
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || 'Failed to get dashboard stats',
      status: error.response?.status,
      data: error.response?.data
    };
  }
};

/**
 * Get Stats API (Admin only)
 * @returns {Promise} Statistics data
 */
export const getStatsAPI = async () => {
  try {
    const response = await api.get('/admin/stats');
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || 'Failed to get stats',
      status: error.response?.status,
      data: error.response?.data
    };
  }
};

/**
 * Create Gift API (Admin only)
 * @param {Object} giftData - Gift data to create
 * @returns {Promise} Created gift data
 */
export const createGiftAPI = async (giftData) => {
  try {
    const response = await api.post('/gifts/products', giftData);
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || 'Failed to create gift',
      status: error.response?.status,
      data: error.response?.data
    };
  }
};

/**
 * Update Gift API (Admin only)
 * @param {string} giftId - Gift ID
 * @param {Object} giftData - Gift data to update
 * @returns {Promise} Updated gift data
 */
export const updateGiftAPI = async (giftId, giftData) => {
  try {
    const response = await api.patch(`/gifts/products/${giftId}`, giftData);
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || 'Failed to update gift',
      status: error.response?.status,
      data: error.response?.data
    };
  }
};

export default api;
