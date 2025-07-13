import api from './config';

// ============================|| GIFTS MANAGEMENT API ||============================ //

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
 * Create Gift API (Admin only)
 * @param {Object} giftData - Gift data to create
 * @param {string} giftData.name - Gift name
 * @param {string} giftData.iconUrl - Gift icon URL
 * @param {number} giftData.price - Gift price
 * @param {string} giftData.status - Gift status (active/inactive)
 * @returns {Promise} Created gift data
 */
export const createGiftAPI = async (giftData) => {
  try {
    const response = await api.post('/gift/products', giftData);
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
 * @param {string} giftData.name - Gift name
 * @param {string} giftData.iconUrl - Gift icon URL
 * @param {number} giftData.price - Gift price
 * @param {string} giftData.status - Gift status (active/inactive)
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

/**
 * Get Gift Details API (Admin only)
 * @param {string} giftId - Gift ID
 * @returns {Promise} Gift details data
 */
export const getGiftDetailsAPI = async (giftId) => {
  try {
    const response = await api.get(`/gifts/products/${giftId}`);
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || 'Failed to get gift details',
      status: error.response?.status,
      data: error.response?.data
    };
  }
};

/**
 * Delete Gift API (Admin only)
 * @param {string} giftId - Gift ID
 * @returns {Promise} Delete result
 */
export const deleteGiftAPI = async (giftId) => {
  try {
    const response = await api.delete(`/gifts/products/${giftId}`);
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || 'Failed to delete gift',
      status: error.response?.status,
      data: error.response?.data
    };
  }
}; 