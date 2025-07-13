// ============================|| API INDEX - EXPORT ALL APIS ||============================ //

// Export API config
export { default as api, API_BASE_URL } from './config';

// Export Authentication APIs
export {
  loginAPI,
  refreshTokenAPI,
  logoutAPI,
  isAuthenticated,
  getToken,
  getRefreshToken,
  requireAuth,
  getUserProfileAPI
} from './auth';

// Export User Management APIs
export {
  getUsersAPI,
  updateUserRoleAPI,
  getUserDetailsAPI,
  updateUserStatusAPI
} from './user';

// Export Gifts Management APIs
export {
  getGiftsAPI,
  createGiftAPI,
  updateGiftAPI,
  getGiftDetailsAPI,
  deleteGiftAPI
} from './gift';

// Export Wallet Management APIs
export {
  getTopupRequestsAPI,
  updateTopupRequestStatusAPI,
  getWithdrawRequestsAPI,
  updateWithdrawRequestStatusAPI,
  getTopupRequestDetailsAPI,
  getWithdrawRequestDetailsAPI
} from './wallet';

// Export Admin Functions APIs
export {
  getConfigAPI,
  updateConfigAPI,
  getDashboardStatsAPI,
  getStatsAPI,
  getSystemHealthAPI,
  getAdminLogsAPI
} from './admin';

// Export Livestream Management APIs
export {
  getStreamsAdminAPI,
  endStreamAdminAPI,
  getStreamAnalyticsAPI,
  getStreamDetailsAPI,
  updateStreamStatusAPI
} from './stream';

// Export Notification Management APIs
export {
  createNotificationAPI,
  createBroadcastNotificationAPI,
  getNotificationStatsAPI,
  getAllNotificationsAPI,
  deleteNotificationAPI,
  markNotificationReadAPI
} from './notification';

// Export Support Chat Management APIs
export {
  getSupportRoomsAPI,
  getSupportChatAPI,
  sendSupportMessageAPI,
  closeSupportRoomAPI,
  getSupportStatsAPI,
  assignSupportRequestAPI
} from './support';

// Export Moderation & Reports APIs
export {
  getReportsAPI,
  handleReportAPI,
  getBannedUsersAPI,
  unbanUserAPI,
  banUserAPI,
  warnUserAPI,
  getModerationStatsAPI,
  getUserModerationHistoryAPI
} from './moderation';

// Export Advanced Analytics APIs
export {
  getRevenueAnalyticsAPI,
  getUserAnalyticsAPI,
  getGiftAnalyticsAPI,
  getStreamAnalyticsDetailAPI,
  getFinancialAnalyticsAPI,
  getPlatformPerformanceAPI,
  exportAnalyticsAPI
} from './analytics';

// Export Admin Tools APIs
export {
  clearSystemCacheAPI,
  getDatabaseStatsAPI,
  optimizeDatabaseAPI,
  getSystemLogsAPI,
  exportSystemLogsAPI,
  getRedisStatsAPI,
  clearRedisAPI,
  getServerPerformanceAPI,
  backupDatabaseAPI,
  restoreDatabaseAPI,
  getAuditLogsAPI
} from './tools';

// Export Transaction Management APIs
export {
  getAllTransactionsAPI,
  getTransactionDetailsAPI,
  updateTransactionStatusAPI,
  getTransactionStatsAPI,
  exportTransactionsAPI,
  getSuspiciousTransactionsAPI,
  flagTransactionAPI,
  unflagTransactionAPI,
  getUserTransactionHistoryAPI,
  createManualTransactionAPI,
  reverseTransactionAPI
} from './transaction';

// Export Menu API
export { useGetMenuMaster, handlerDrawerOpen } from './menu';

// ============================|| API MODULES SUMMARY ||============================ //

/**
 * API MODULES ORGANIZATION:
 * 
 * 📁 config.js - Base axios configuration and interceptors
 * 📁 auth.js - Authentication related APIs
 * 📁 user.js - User management APIs
 * 📁 gift.js - Gifts management APIs
 * 📁 wallet.js - Wallet/Payment related APIs
 * 📁 admin.js - Admin functions (config, stats, logs)
 * 📁 menu.js - Menu state management
 * 📁 index.js - Central export point
 * 
 * USAGE EXAMPLES:
 * 
 * // Import specific APIs
 * import { loginAPI, getUsersAPI } from 'api';
 * 
 * // Import all from specific module
 * import * as AuthAPI from 'api/auth';
 * 
 * // Import config
 * import { api, API_BASE_URL } from 'api';
 */ 