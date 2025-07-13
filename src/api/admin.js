import api from './config';

// ============================|| ADMIN FUNCTIONS API ||============================ //

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
 * Get System Health API (Admin only)
 * @returns {Promise} System health data
 */
export const getSystemHealthAPI = async () => {
  try {
    const response = await api.get('/admin/health');
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || 'Failed to get system health',
      status: error.response?.status,
      data: error.response?.data
    };
  }
};

/**
 * Get Admin Logs API (Admin only)
 * @param {Object} params - Query parameters
 * @param {string} params.level - Log level filter
 * @param {number} params.page - Page number
 * @param {number} params.limit - Items per page
 * @returns {Promise} Admin logs data
 */
export const getAdminLogsAPI = async (params = {}) => {
  try {
    const response = await api.get('/admin/logs', { params });
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || 'Failed to get admin logs',
      status: error.response?.status,
      data: error.response?.data
    };
  }
}; 