import api from './config';

// ============================|| MODERATION & REPORTS API ||============================ //

/**
 * Get Reports (Admin/Moderator)
 * @param {Object} params - Query parameters
 * @param {string} params.type - Report type (user/stream/chat)
 * @param {string} params.status - Report status (pending/resolved/dismissed)
 * @param {number} params.page - Page number
 * @param {number} params.limit - Items per page
 * @returns {Promise} Reports data
 */
export const getReportsAPI = async (params = {}) => {
  try {
    const response = await api.get('/admin/reports', { params });
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || 'Failed to get reports',
      status: error.response?.status,
      data: error.response?.data
    };
  }
};

/**
 * Handle Report (Admin/Moderator)
 * @param {string} reportId - Report ID
 * @param {Object} data - Action data
 * @param {string} data.action - Action to take (dismiss/warn_user/ban_user/permanent_ban/remove_content)
 * @param {number} data.duration - Duration for ban (in days)
 * @param {string} data.reason - Reason for action
 * @param {string} data.adminNote - Admin note
 * @returns {Promise} Handle result
 */
export const handleReportAPI = async (reportId, data) => {
  try {
    const response = await api.patch(`/admin/reports/${reportId}`, data);
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || 'Failed to handle report',
      status: error.response?.status,
      data: error.response?.data
    };
  }
};

/**
 * Get Banned Users (Admin/Moderator)
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number
 * @param {number} params.limit - Items per page
 * @returns {Promise} Banned users data
 */
export const getBannedUsersAPI = async (params = {}) => {
  try {
    const response = await api.get('/admin/banned-users', { params });
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || 'Failed to get banned users',
      status: error.response?.status,
      data: error.response?.data
    };
  }
};

/**
 * Unban User (Admin/Superadmin)
 * @param {string} userId - User ID
 * @param {Object} data - Unban data
 * @param {string} data.reason - Reason for unban
 * @param {string} data.adminNote - Admin note
 * @returns {Promise} Unban result
 */
export const unbanUserAPI = async (userId, data) => {
  try {
    const response = await api.patch(`/admin/users/${userId}/unban`, data);
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || 'Failed to unban user',
      status: error.response?.status,
      data: error.response?.data
    };
  }
};

/**
 * Ban User (Admin/Superadmin)
 * @param {string} userId - User ID
 * @param {Object} data - Ban data
 * @param {string} data.reason - Reason for ban
 * @param {number} data.duration - Duration in days (0 for permanent)
 * @param {string} data.adminNote - Admin note
 * @returns {Promise} Ban result
 */
export const banUserAPI = async (userId, data) => {
  try {
    const response = await api.patch(`/admin/users/${userId}/ban`, data);
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || 'Failed to ban user',
      status: error.response?.status,
      data: error.response?.data
    };
  }
};

/**
 * Warn User (Admin/Moderator)
 * @param {string} userId - User ID
 * @param {Object} data - Warning data
 * @param {string} data.reason - Reason for warning
 * @param {string} data.message - Warning message
 * @param {string} data.adminNote - Admin note
 * @returns {Promise} Warning result
 */
export const warnUserAPI = async (userId, data) => {
  try {
    const response = await api.patch(`/admin/users/${userId}/warn`, data);
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || 'Failed to warn user',
      status: error.response?.status,
      data: error.response?.data
    };
  }
};

/**
 * Get Moderation Statistics (Admin)
 * @returns {Promise} Moderation statistics data
 */
export const getModerationStatsAPI = async () => {
  try {
    const response = await api.get('/admin/moderation/stats');
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || 'Failed to get moderation stats',
      status: error.response?.status,
      data: error.response?.data
    };
  }
};

/**
 * Get User Moderation History (Admin)
 * @param {string} userId - User ID
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number
 * @param {number} params.limit - Items per page
 * @returns {Promise} User moderation history data
 */
export const getUserModerationHistoryAPI = async (userId, params = {}) => {
  try {
    const response = await api.get(`/admin/users/${userId}/moderation-history`, { params });
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || 'Failed to get user moderation history',
      status: error.response?.status,
      data: error.response?.data
    };
  }
}; 