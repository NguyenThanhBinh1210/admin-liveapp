import api from './config';

// ============================|| TRANSACTION MANAGEMENT API ||============================ //

/**
 * Get All Transactions (Admin)
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number
 * @param {number} params.limit - Items per page
 * @param {string} params.type - Transaction type (TOPUP/WITHDRAW/GIFT/REWARD/REFERRAL)
 * @param {string} params.status - Transaction status (pending/approved/rejected/completed/failed/cancelled)
 * @param {string} params.userId - User ID filter
 * @param {string} params.startDate - Start date filter
 * @param {string} params.endDate - End date filter
 * @returns {Promise} All transactions data
 */
export const getAllTransactionsAPI = async (params = {}) => {
  try {
    const response = await api.get('/wallet/transactions/all', { params });
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || 'Failed to get all transactions',
      status: error.response?.status,
      data: error.response?.data
    };
  }
};

/**
 * Get Transaction Details (Admin)
 * @param {string} transactionId - Transaction ID
 * @returns {Promise} Transaction details data
 */
export const getTransactionDetailsAPI = async (transactionId) => {
  try {
    const response = await api.get(`/wallet/transactions/${transactionId}`);
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || 'Failed to get transaction details',
      status: error.response?.status,
      data: error.response?.data
    };
  }
};

/**
 * Update Transaction Status (Admin)
 * @param {string} transactionId - Transaction ID
 * @param {Object} data - Update data
 * @param {string} data.status - New status
 * @param {string} data.adminNote - Admin note
 * @param {string} data.reason - Reason for status change
 * @returns {Promise} Update result
 */
export const updateTransactionStatusAPI = async (transactionId, data) => {
  try {
    const response = await api.patch(`/wallet/transactions/${transactionId}/status`, data);
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || 'Failed to update transaction status',
      status: error.response?.status,
      data: error.response?.data
    };
  }
};

/**
 * Get Transaction Statistics (Admin)
 * @param {Object} params - Query parameters
 * @param {string} params.period - Period (day/week/month/year)
 * @param {string} params.type - Transaction type filter
 * @returns {Promise} Transaction statistics data
 */
export const getTransactionStatsAPI = async (params = {}) => {
  try {
    const response = await api.get('/wallet/transactions/stats', { params });
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || 'Failed to get transaction stats',
      status: error.response?.status,
      data: error.response?.data
    };
  }
};

/**
 * Export Transactions (Admin)
 * @param {Object} params - Export parameters
 * @param {string} params.format - Export format (csv/excel/pdf)
 * @param {string} params.type - Transaction type filter
 * @param {string} params.status - Transaction status filter
 * @param {string} params.startDate - Start date filter
 * @param {string} params.endDate - End date filter
 * @returns {Promise} Export result
 */
export const exportTransactionsAPI = async (params = {}) => {
  try {
    const response = await api.get('/wallet/transactions/export', { 
      params,
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || 'Failed to export transactions',
      status: error.response?.status,
      data: error.response?.data
    };
  }
};

/**
 * Get Suspicious Transactions (Admin)
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number
 * @param {number} params.limit - Items per page
 * @param {number} params.minAmount - Minimum amount filter
 * @param {string} params.type - Transaction type filter
 * @returns {Promise} Suspicious transactions data
 */
export const getSuspiciousTransactionsAPI = async (params = {}) => {
  try {
    const response = await api.get('/wallet/transactions/suspicious', { params });
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || 'Failed to get suspicious transactions',
      status: error.response?.status,
      data: error.response?.data
    };
  }
};

/**
 * Flag Transaction as Suspicious (Admin)
 * @param {string} transactionId - Transaction ID
 * @param {Object} data - Flag data
 * @param {string} data.reason - Reason for flagging
 * @param {string} data.adminNote - Admin note
 * @param {string} data.severity - Severity level (low/medium/high)
 * @returns {Promise} Flag result
 */
export const flagTransactionAPI = async (transactionId, data) => {
  try {
    const response = await api.post(`/wallet/transactions/${transactionId}/flag`, data);
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || 'Failed to flag transaction',
      status: error.response?.status,
      data: error.response?.data
    };
  }
};

/**
 * Unflag Transaction (Admin)
 * @param {string} transactionId - Transaction ID
 * @param {Object} data - Unflag data
 * @param {string} data.reason - Reason for unflagging
 * @param {string} data.adminNote - Admin note
 * @returns {Promise} Unflag result
 */
export const unflagTransactionAPI = async (transactionId, data) => {
  try {
    const response = await api.delete(`/wallet/transactions/${transactionId}/flag`, { data });
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || 'Failed to unflag transaction',
      status: error.response?.status,
      data: error.response?.data
    };
  }
};

/**
 * Get User Transaction History (Admin)
 * @param {string} userId - User ID
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number
 * @param {number} params.limit - Items per page
 * @param {string} params.type - Transaction type filter
 * @param {string} params.status - Transaction status filter
 * @returns {Promise} User transaction history data
 */
export const getUserTransactionHistoryAPI = async (userId, params = {}) => {
  try {
    const response = await api.get(`/wallet/users/${userId}/transactions`, { params });
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || 'Failed to get user transaction history',
      status: error.response?.status,
      data: error.response?.data
    };
  }
};

/**
 * Create Manual Transaction (Admin)
 * @param {Object} data - Transaction data
 * @param {string} data.userId - User ID
 * @param {string} data.type - Transaction type
 * @param {number} data.amount - Transaction amount
 * @param {string} data.description - Transaction description
 * @param {string} data.adminNote - Admin note
 * @returns {Promise} Create result
 */
export const createManualTransactionAPI = async (data) => {
  try {
    const response = await api.post('/wallet/transactions/manual', data);
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || 'Failed to create manual transaction',
      status: error.response?.status,
      data: error.response?.data
    };
  }
};

/**
 * Reverse Transaction (Admin)
 * @param {string} transactionId - Transaction ID
 * @param {Object} data - Reverse data
 * @param {string} data.reason - Reason for reversal
 * @param {string} data.adminNote - Admin note
 * @returns {Promise} Reverse result
 */
export const reverseTransactionAPI = async (transactionId, data) => {
  try {
    const response = await api.post(`/wallet/transactions/${transactionId}/reverse`, data);
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || 'Failed to reverse transaction',
      status: error.response?.status,
      data: error.response?.data
    };
  }
}; 