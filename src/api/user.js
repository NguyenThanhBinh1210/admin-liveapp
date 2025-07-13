import api from './config';

// ============================|| USER MANAGEMENT API ||============================ //

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
 * Get User Details API (Admin only)
 * @param {string} userId - User ID
 * @returns {Promise} User details data
 */
export const getUserDetailsAPI = async (userId) => {
  try {
    const response = await api.get(`/admin/users/${userId}`);
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || 'Failed to get user details',
      status: error.response?.status,
      data: error.response?.data
    };
  }
};

/**
 * Update User Status API (Admin only)
 * @param {string} userId - User ID
 * @param {string} status - New status (active/inactive)
 * @returns {Promise} Update result
 */
export const updateUserStatusAPI = async (userId, status) => {
  try {
    const response = await api.patch(`/admin/users/${userId}/status`, { status });
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || 'Failed to update user status',
      status: error.response?.status,
      data: error.response?.data
    };
  }
}; 