import api from './config';

// ============================|| SUPPORT CHAT MANAGEMENT API ||============================ //

/**
 * Get All Support Rooms (Admin/Staff)
 * @param {Object} params - Query parameters
 * @param {string} params.status - Room status filter (open/closed)
 * @param {number} params.page - Page number
 * @param {number} params.limit - Items per page
 * @returns {Promise} Support rooms data
 */
export const getSupportRoomsAPI = async (params = {}) => {
  try {
    const response = await api.get('/chat/support/rooms', { params });
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || 'Failed to get support rooms',
      status: error.response?.status,
      data: error.response?.data
    };
  }
};

/**
 * Get Support Chat Messages for Specific User
 * @param {string} userId - User ID
 * @param {Object} params - Query parameters
 * @param {string} params.cursor - Cursor for pagination
 * @param {number} params.limit - Items per page
 * @param {string} params.order - Order (asc/desc)
 * @returns {Promise} Support chat messages data
 */
export const getSupportChatAPI = async (userId, params = {}) => {
  try {
    const response = await api.get(`/chat/support/${userId}`, { params });
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || 'Failed to get support chat',
      status: error.response?.status,
      data: error.response?.data
    };
  }
};

/**
 * Send Support Message (Admin/Staff)
 * @param {Object} messageData - Message data
 * @param {string} messageData.roomId - Room ID
 * @param {string} messageData.message - Message content
 * @param {boolean} messageData.isSupport - Is support message
 * @param {string} messageData.sentBy - Sender type (admin/staff)
 * @returns {Promise} Send message result
 */
export const sendSupportMessageAPI = async (messageData) => {
  try {
    const response = await api.post('/chat/send', messageData);
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || 'Failed to send support message',
      status: error.response?.status,
      data: error.response?.data
    };
  }
};

/**
 * Close Support Room (Admin/Staff)
 * @param {string} roomId - Room ID
 * @param {Object} data - Close room data
 * @param {string} data.reason - Reason for closing
 * @param {string} data.adminNote - Admin note
 * @returns {Promise} Close room result
 */
export const closeSupportRoomAPI = async (roomId, data) => {
  try {
    const response = await api.patch(`/chat/support/rooms/${roomId}/close`, data);
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || 'Failed to close support room',
      status: error.response?.status,
      data: error.response?.data
    };
  }
};

/**
 * Get Support Statistics (Admin)
 * @returns {Promise} Support statistics data
 */
export const getSupportStatsAPI = async () => {
  try {
    const response = await api.get('/chat/support/stats');
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || 'Failed to get support stats',
      status: error.response?.status,
      data: error.response?.data
    };
  }
};

/**
 * Assign Support Request to Staff (Admin)
 * @param {string} roomId - Room ID
 * @param {Object} data - Assignment data
 * @param {string} data.staffId - Staff ID to assign
 * @param {string} data.priority - Priority level
 * @returns {Promise} Assignment result
 */
export const assignSupportRequestAPI = async (roomId, data) => {
  try {
    const response = await api.patch(`/chat/support/rooms/${roomId}/assign`, data);
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || 'Failed to assign support request',
      status: error.response?.status,
      data: error.response?.data
    };
  }
}; 