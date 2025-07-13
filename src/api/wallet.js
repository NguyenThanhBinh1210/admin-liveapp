import api from './config';

// ============================|| WALLET MANAGEMENT API ||============================ //

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
 * @param {string} status - New status (pending/approved/rejected)
 * @param {string} adminNote - Admin note
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
 * @param {string} status - New status (pending/approved/rejected)
 * @param {string} adminNote - Admin note
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
 * Get Topup Request Details API (Admin only)
 * @param {string} requestId - Request ID
 * @returns {Promise} Topup request details
 */
export const getTopupRequestDetailsAPI = async (requestId) => {
  try {
    const response = await api.get(`/wallet/topup/${requestId}`);
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || 'Failed to get topup request details',
      status: error.response?.status,
      data: error.response?.data
    };
  }
};

/**
 * Get Withdraw Request Details API (Admin only)
 * @param {string} requestId - Request ID
 * @returns {Promise} Withdraw request details
 */
export const getWithdrawRequestDetailsAPI = async (requestId) => {
  try {
    const response = await api.get(`/wallet/withdraw/${requestId}`);
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || 'Failed to get withdraw request details',
      status: error.response?.status,
      data: error.response?.data
    };
  }
}; 