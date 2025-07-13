import api from './config';

// ============================|| NOTIFICATION MANAGEMENT API ||============================ //

/**
 * Create Notification for Specific User
 * @param {Object} notificationData - Notification data
 * @param {string} notificationData.userId - User ID
 * @param {string} notificationData.title - Notification title
 * @param {string} notificationData.content - Notification content
 * @param {string} notificationData.type - Notification type
 * @param {Object} notificationData.metadata - Additional metadata
 * @returns {Promise} Created notification data
 */
export const createNotificationAPI = async (notificationData) => {
  try {
    const response = await api.post('/notifications', notificationData);
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || 'Failed to create notification',
      status: error.response?.status,
      data: error.response?.data
    };
  }
};

/**
 * Create Broadcast Notification
 * @param {Object} broadcastData - Broadcast data
 * @param {string} broadcastData.title - Notification title
 * @param {string} broadcastData.content - Notification content
 * @param {string} broadcastData.type - Notification type
 * @param {Object} broadcastData.metadata - Additional metadata
 * @param {Array} broadcastData.targetUserIds - Target user IDs (optional)
 * @returns {Promise} Broadcast result
 */
export const createBroadcastNotificationAPI = async (broadcastData) => {
  try {
    const response = await api.post('/notifications/broadcast', broadcastData);
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || 'Failed to create broadcast notification',
      status: error.response?.status,
      data: error.response?.data
    };
  }
};

/**
 * Get Notification Statistics (Admin)
 * @returns {Promise} Notification statistics data
 */
export const getNotificationStatsAPI = async () => {
  try {
    const response = await api.get('/notifications/admin/stats');
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || 'Failed to get notification stats',
      status: error.response?.status,
      data: error.response?.data
    };
  }
};

/**
 * Get All Notifications (Admin)
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number
 * @param {number} params.limit - Items per page
 * @param {string} params.type - Notification type filter
 * @param {string} params.userId - User ID filter
 * @param {boolean} params.read - Read status filter
 * @returns {Promise} Notifications data
 */
export const getAllNotificationsAPI = async (params = {}) => {
  try {
    const response = await api.get('/notifications/admin/all', { params });
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || 'Failed to get notifications',
      status: error.response?.status,
      data: error.response?.data
    };
  }
};

/**
 * Delete Notification (Admin)
 * @param {string} notificationId - Notification ID
 * @returns {Promise} Delete result
 */
export const deleteNotificationAPI = async (notificationId) => {
  try {
    const response = await api.delete(`/notifications/${notificationId}`);
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || 'Failed to delete notification',
      status: error.response?.status,
      data: error.response?.data
    };
  }
};

/**
 * Mark Notification as Read (Admin)
 * @param {string} notificationId - Notification ID
 * @returns {Promise} Update result
 */
export const markNotificationReadAPI = async (notificationId) => {
  try {
    const response = await api.patch(`/notifications/${notificationId}/read`);
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || 'Failed to mark notification as read',
      status: error.response?.status,
      data: error.response?.data
    };
  }
}; 