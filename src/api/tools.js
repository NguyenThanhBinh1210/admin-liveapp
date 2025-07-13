import api from './config';

// ============================|| ADMIN TOOLS API ||============================ //

/**
 * Clear System Cache
 * @param {Object} data - Cache clear options
 * @param {Array} data.cacheTypes - Types of cache to clear
 * @returns {Promise} Cache clear result
 */
export const clearSystemCacheAPI = async (data = {}) => {
  try {
    const response = await api.post('/admin/tools/cache/clear', data);
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || 'Failed to clear system cache',
      status: error.response?.status,
      data: error.response?.data
    };
  }
};

/**
 * Get System Health
 * @returns {Promise} System health data
 */
export const getSystemHealthAPI = async () => {
  try {
    const response = await api.get('/admin/tools/health');
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
 * Get Database Statistics
 * @returns {Promise} Database statistics data
 */
export const getDatabaseStatsAPI = async () => {
  try {
    const response = await api.get('/admin/tools/database/stats');
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || 'Failed to get database stats',
      status: error.response?.status,
      data: error.response?.data
    };
  }
};

/**
 * Optimize Database
 * @param {Object} data - Optimization options
 * @param {Array} data.collections - Collections to optimize
 * @returns {Promise} Optimization result
 */
export const optimizeDatabaseAPI = async (data = {}) => {
  try {
    const response = await api.post('/admin/tools/database/optimize', data);
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || 'Failed to optimize database',
      status: error.response?.status,
      data: error.response?.data
    };
  }
};

/**
 * Get System Logs
 * @param {Object} params - Query parameters
 * @param {string} params.level - Log level (info/warn/error)
 * @param {number} params.page - Page number
 * @param {number} params.limit - Items per page
 * @param {string} params.startDate - Start date filter
 * @param {string} params.endDate - End date filter
 * @returns {Promise} System logs data
 */
export const getSystemLogsAPI = async (params = {}) => {
  try {
    const response = await api.get('/admin/tools/logs', { params });
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || 'Failed to get system logs',
      status: error.response?.status,
      data: error.response?.data
    };
  }
};

/**
 * Export System Logs
 * @param {Object} params - Export parameters
 * @param {string} params.level - Log level filter
 * @param {string} params.format - Export format (csv/json)
 * @param {string} params.startDate - Start date filter
 * @param {string} params.endDate - End date filter
 * @returns {Promise} Export result
 */
export const exportSystemLogsAPI = async (params = {}) => {
  try {
    const response = await api.get('/admin/tools/logs/export', { 
      params,
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || 'Failed to export system logs',
      status: error.response?.status,
      data: error.response?.data
    };
  }
};

/**
 * Get Redis Statistics
 * @returns {Promise} Redis statistics data
 */
export const getRedisStatsAPI = async () => {
  try {
    const response = await api.get('/admin/tools/redis/stats');
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || 'Failed to get Redis stats',
      status: error.response?.status,
      data: error.response?.data
    };
  }
};

/**
 * Clear Redis Cache
 * @param {Object} data - Redis clear options
 * @param {Array} data.keys - Specific keys to clear
 * @param {string} data.pattern - Pattern to match keys
 * @returns {Promise} Redis clear result
 */
export const clearRedisAPI = async (data = {}) => {
  try {
    const response = await api.post('/admin/tools/redis/clear', data);
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || 'Failed to clear Redis cache',
      status: error.response?.status,
      data: error.response?.data
    };
  }
};

/**
 * Get Server Performance Metrics
 * @param {Object} params - Query parameters
 * @param {string} params.period - Period (1h/6h/24h/7d)
 * @returns {Promise} Server performance data
 */
export const getServerPerformanceAPI = async (params = {}) => {
  try {
    const response = await api.get('/admin/tools/performance', { params });
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || 'Failed to get server performance',
      status: error.response?.status,
      data: error.response?.data
    };
  }
};

/**
 * Backup Database
 * @param {Object} data - Backup options
 * @param {Array} data.collections - Collections to backup
 * @param {string} data.format - Backup format
 * @returns {Promise} Backup result
 */
export const backupDatabaseAPI = async (data = {}) => {
  try {
    const response = await api.post('/admin/tools/database/backup', data);
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || 'Failed to backup database',
      status: error.response?.status,
      data: error.response?.data
    };
  }
};

/**
 * Restore Database
 * @param {Object} data - Restore options
 * @param {string} data.backupId - Backup ID to restore
 * @returns {Promise} Restore result
 */
export const restoreDatabaseAPI = async (data = {}) => {
  try {
    const response = await api.post('/admin/tools/database/restore', data);
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || 'Failed to restore database',
      status: error.response?.status,
      data: error.response?.data
    };
  }
};

/**
 * Get Audit Logs
 * @param {Object} params - Query parameters
 * @param {string} params.adminId - Admin ID filter
 * @param {string} params.action - Action filter
 * @param {string} params.resource - Resource filter
 * @param {number} params.page - Page number
 * @param {number} params.limit - Items per page
 * @returns {Promise} Audit logs data
 */
export const getAuditLogsAPI = async (params = {}) => {
  try {
    const response = await api.get('/admin/tools/audit-logs', { params });
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || 'Failed to get audit logs',
      status: error.response?.status,
      data: error.response?.data
    };
  }
}; 