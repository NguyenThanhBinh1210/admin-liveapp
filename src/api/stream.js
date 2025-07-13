import api from './config';

// ============================|| LIVESTREAM MANAGEMENT API ||============================ //

/**
 * Get All Streams (Admin view)
 * @param {Object} params - Query parameters
 * @param {string} params.status - Status filter (live/ended/scheduled)
 * @param {string} params.streamerId - Streamer ID filter
 * @param {number} params.page - Page number
 * @param {number} params.limit - Items per page
 * @returns {Promise} Streams data
 */
export const getStreamsAdminAPI = async (params = {}) => {
  try {
    const response = await api.get('/stream/admin', { params });
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || 'Failed to get streams',
      status: error.response?.status,
      data: error.response?.data
    };
  }
};

/**
 * End Stream (Admin action)
 * @param {string} streamId - Stream ID
 * @param {Object} data - End stream data
 * @param {string} data.reason - Reason for ending stream
 * @param {string} data.adminNote - Admin note
 * @returns {Promise} End stream result
 */
export const endStreamAdminAPI = async (streamId, data) => {
  try {
    const response = await api.delete(`/stream/${streamId}`, { data });
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || 'Failed to end stream',
      status: error.response?.status,
      data: error.response?.data
    };
  }
};

/**
 * Get Stream Analytics (Admin)
 * @param {Object} params - Query parameters
 * @param {string} params.type - Analytics type (streams/viewers/rooms)
 * @returns {Promise} Stream analytics data
 */
export const getStreamAnalyticsAPI = async (params = {}) => {
  try {
    const response = await api.get('/stream/admin/analytics', { params });
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
 * Get Stream Details (Admin)
 * @param {string} streamId - Stream ID
 * @returns {Promise} Stream details data
 */
export const getStreamDetailsAPI = async (streamId) => {
  try {
    const response = await api.get(`/stream/admin/${streamId}`);
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || 'Failed to get stream details',
      status: error.response?.status,
      data: error.response?.data
    };
  }
};

/**
 * Update Stream Status (Admin)
 * @param {string} streamId - Stream ID
 * @param {Object} data - Update data
 * @param {string} data.status - New status
 * @param {string} data.reason - Reason for status change
 * @param {string} data.adminNote - Admin note
 * @returns {Promise} Update result
 */
export const updateStreamStatusAPI = async (streamId, data) => {
  try {
    const response = await api.patch(`/stream/admin/${streamId}/status`, data);
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || 'Failed to update stream status',
      status: error.response?.status,
      data: error.response?.data
    };
  }
}; 