import api from './config';

// ============================|| ADVANCED ANALYTICS API ||============================ //

/**
 * Get Revenue Analytics
 * @param {Object} params - Query parameters
 * @param {string} params.period - Period (day/week/month/year)
 * @param {number} params.year - Year filter
 * @param {number} params.month - Month filter
 * @returns {Promise} Revenue analytics data
 */
export const getRevenueAnalyticsAPI = async (params = {}) => {
  try {
    const response = await api.get('/admin/analytics/revenue', { params });
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || 'Failed to get revenue analytics',
      status: error.response?.status,
      data: error.response?.data
    };
  }
};

/**
 * Get User Analytics
 * @param {Object} params - Query parameters
 * @param {string} params.period - Period (day/week/month/year)
 * @param {number} params.year - Year filter
 * @param {number} params.month - Month filter
 * @returns {Promise} User analytics data
 */
export const getUserAnalyticsAPI = async (params = {}) => {
  try {
    const response = await api.get('/admin/analytics/users', { params });
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || 'Failed to get user analytics',
      status: error.response?.status,
      data: error.response?.data
    };
  }
};

/**
 * Get Gift Analytics
 * @param {Object} params - Query parameters
 * @param {string} params.period - Period (day/week/month/year)
 * @param {number} params.year - Year filter
 * @param {number} params.month - Month filter
 * @returns {Promise} Gift analytics data
 */
export const getGiftAnalyticsAPI = async (params = {}) => {
  try {
    const response = await api.get('/admin/analytics/gifts', { params });
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || 'Failed to get gift analytics',
      status: error.response?.status,
      data: error.response?.data
    };
  }
};

/**
 * Get Stream Analytics
 * @param {Object} params - Query parameters
 * @param {string} params.period - Period (day/week/month/year)
 * @param {number} params.year - Year filter
 * @param {number} params.month - Month filter
 * @returns {Promise} Stream analytics data
 */
export const getStreamAnalyticsDetailAPI = async (params = {}) => {
  try {
    const response = await api.get('/admin/analytics/streams', { params });
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || 'Failed to get stream analytics',
      status: error.response?.status,
      data: error.response?.data
    };
  }
};

/**
 * Get Financial Analytics
 * @param {Object} params - Query parameters
 * @param {string} params.period - Period (day/week/month/year)
 * @param {number} params.year - Year filter
 * @param {number} params.month - Month filter
 * @returns {Promise} Financial analytics data
 */
export const getFinancialAnalyticsAPI = async (params = {}) => {
  try {
    const response = await api.get('/admin/analytics/financial', { params });
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || 'Failed to get financial analytics',
      status: error.response?.status,
      data: error.response?.data
    };
  }
};

/**
 * Get Platform Performance Analytics
 * @param {Object} params - Query parameters
 * @param {string} params.period - Period (day/week/month/year)
 * @returns {Promise} Platform performance analytics data
 */
export const getPlatformPerformanceAPI = async (params = {}) => {
  try {
    const response = await api.get('/admin/analytics/performance', { params });
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || 'Failed to get platform performance',
      status: error.response?.status,
      data: error.response?.data
    };
  }
};

/**
 * Export Analytics Data
 * @param {Object} params - Export parameters
 * @param {string} params.type - Export type (revenue/users/gifts/streams)
 * @param {string} params.format - Export format (csv/excel/pdf)
 * @param {string} params.period - Period (day/week/month/year)
 * @returns {Promise} Export result
 */
export const exportAnalyticsAPI = async (params = {}) => {
  try {
    const response = await api.get('/admin/analytics/export', { 
      params,
      responseType: 'blob' // For file download
    });
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || 'Failed to export analytics',
      status: error.response?.status,
      data: error.response?.data
    };
  }
}; 