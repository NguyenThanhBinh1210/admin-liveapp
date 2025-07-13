import { useState, useEffect } from 'react';

// material-ui
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';
import TablePagination from '@mui/material/TablePagination';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Snackbar from '@mui/material/Snackbar';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';

// project imports
import MainCard from 'components/MainCard';
import { 
  getAllNotificationsAPI, 
  getNotificationStatsAPI, 
  createNotificationAPI, 
  createBroadcastNotificationAPI,
  deleteNotificationAPI,
  markNotificationReadAPI
} from 'api';

// assets
import NotificationOutlined from '@ant-design/icons/NotificationOutlined';
import SearchOutlined from '@ant-design/icons/SearchOutlined';
import FilterOutlined from '@ant-design/icons/FilterOutlined';
import UserOutlined from '@ant-design/icons/UserOutlined';
import PlusOutlined from '@ant-design/icons/PlusOutlined';
import SendOutlined from '@ant-design/icons/SendOutlined';
import DeleteOutlined from '@ant-design/icons/DeleteOutlined';
import CheckOutlined from '@ant-design/icons/CheckOutlined';
import BellOutlined from '@ant-design/icons/BellOutlined';
import MessageOutlined from '@ant-design/icons/MessageOutlined';
import GlobalOutlined from '@ant-design/icons/GlobalOutlined';

// ==============================|| NOTIFICATIONS MANAGEMENT PAGE ||============================== //

const TYPE_OPTIONS = [
  { value: '', label: 'All Types' },
  { value: 'system', label: 'System' },
  { value: 'gift', label: 'Gift' },
  { value: 'topup', label: 'Top-up' },
  { value: 'withdraw', label: 'Withdraw' },
  { value: 'stream', label: 'Stream' }
];

const READ_OPTIONS = [
  { value: '', label: 'All Status' },
  { value: 'true', label: 'Read' },
  { value: 'false', label: 'Unread' }
];

const NOTIFICATION_TYPES = [
  { value: 'system', label: 'System Notification' },
  { value: 'promotion', label: 'Promotion' },
  { value: 'announcement', label: 'Announcement' },
  { value: 'maintenance', label: 'Maintenance' }
];

const PRIORITY_LEVELS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' }
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Filter states
  const [filters, setFilters] = useState({
    type: '',
    userId: '',
    read: '',
    page: 1,
    limit: 10
  });

  // Temporary filter states for form
  const [tempFilters, setTempFilters] = useState({
    type: '',
    userId: '',
    read: ''
  });

  // Create notification dialog
  const [createDialog, setCreateDialog] = useState({
    open: false,
    type: 'single', // single or broadcast
    loading: false,
    data: {
      userId: '',
      title: '',
      content: '',
      type: 'system',
      priority: 'medium',
      targetUserIds: []
    }
  });

  // Broadcast dialog
  const [broadcastDialog, setBroadcastDialog] = useState({
    open: false,
    loading: false,
    data: {
      title: '',
      content: '',
      type: 'system',
      priority: 'medium',
      targetUserIds: [],
      targetAll: true
    }
  });

  useEffect(() => {
    fetchNotifications();
    fetchStats();
  }, [filters]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError('');

      // Prepare params - always include page and limit
      const params = {
        page: filters.page,
        limit: filters.limit
      };

      // Add optional filters
      if (filters.type) params.type = filters.type;
      if (filters.userId) params.userId = filters.userId;
      if (filters.read !== '') params.read = filters.read === 'true';

      const response = await getAllNotificationsAPI(params);

      if (response.status === 'success' && response.data) {
        setNotifications(response.data.notifications || []);
        setPagination(response.data.pagination || null);
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
      setError(err.message || 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const response = await getNotificationStatsAPI();

      if (response.status === 'success' && response.data) {
        setStats(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch notification stats:', err);
    } finally {
      setStatsLoading(false);
    }
  };

  // Handle filter form submission
  const handleSearch = () => {
    setFilters(prev => ({
      ...prev,
      type: tempFilters.type,
      userId: tempFilters.userId,
      read: tempFilters.read,
      page: 1 // Reset to first page when filtering
    }));
  };

  // Handle clear filters
  const handleClearFilters = () => {
    setTempFilters({ type: '', userId: '', read: '' });
    setFilters({ type: '', userId: '', read: '', page: 1, limit: 10 });
  };

  // Handle pagination
  const handlePageChange = (event, newPage) => {
    setFilters(prev => ({
      ...prev,
      page: newPage + 1 // TablePagination uses 0-based indexing
    }));
  };

  const handleRowsPerPageChange = (event) => {
    setFilters(prev => ({
      ...prev,
      limit: parseInt(event.target.value, 10),
      page: 1
    }));
  };

  // Handle create single notification
  const handleCreateNotification = async () => {
    if (!createDialog.data.userId || !createDialog.data.title || !createDialog.data.content) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setCreateDialog(prev => ({ ...prev, loading: true }));

      const notificationData = {
        userId: createDialog.data.userId,
        title: createDialog.data.title,
        content: createDialog.data.content,
        type: createDialog.data.type,
        metadata: {
          priority: createDialog.data.priority,
          createdByAdmin: true
        }
      };

      const response = await createNotificationAPI(notificationData);

      if (response.status === 'success') {
        setSuccessMessage('Notification created successfully');
        setCreateDialog({
          open: false,
          type: 'single',
          loading: false,
          data: {
            userId: '',
            title: '',
            content: '',
            type: 'system',
            priority: 'medium',
            targetUserIds: []
          }
        });
        await fetchNotifications();
        await fetchStats();
      }
    } catch (err) {
      console.error('Failed to create notification:', err);
      setError(err.message || 'Failed to create notification');
    } finally {
      setCreateDialog(prev => ({ ...prev, loading: false }));
    }
  };

  // Handle create broadcast notification
  const handleCreateBroadcast = async () => {
    if (!broadcastDialog.data.title || !broadcastDialog.data.content) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setBroadcastDialog(prev => ({ ...prev, loading: true }));

      const broadcastData = {
        title: broadcastDialog.data.title,
        content: broadcastDialog.data.content,
        type: broadcastDialog.data.type,
        metadata: {
          priority: broadcastDialog.data.priority,
          createdByAdmin: true
        }
      };

      // Add target users if not broadcasting to all
      if (!broadcastDialog.data.targetAll && broadcastDialog.data.targetUserIds.length > 0) {
        broadcastData.targetUserIds = broadcastDialog.data.targetUserIds;
      }

      const response = await createBroadcastNotificationAPI(broadcastData);

      if (response.status === 'success') {
        setSuccessMessage(`Broadcast notification sent to ${response.data.totalCreated} users`);
        setBroadcastDialog({
          open: false,
          loading: false,
          data: {
            title: '',
            content: '',
            type: 'system',
            priority: 'medium',
            targetUserIds: [],
            targetAll: true
          }
        });
        await fetchNotifications();
        await fetchStats();
      }
    } catch (err) {
      console.error('Failed to create broadcast:', err);
      setError(err.message || 'Failed to create broadcast notification');
    } finally {
      setBroadcastDialog(prev => ({ ...prev, loading: false }));
    }
  };

  // Handle delete notification
  const handleDeleteNotification = async (notificationId) => {
    if (!confirm('Are you sure you want to delete this notification?')) return;

    try {
      const response = await deleteNotificationAPI(notificationId);

      if (response.status === 'success') {
        setSuccessMessage('Notification deleted successfully');
        await fetchNotifications();
        await fetchStats();
      }
    } catch (err) {
      console.error('Failed to delete notification:', err);
      setError(err.message || 'Failed to delete notification');
    }
  };

  // Handle mark as read
  const handleMarkAsRead = async (notificationId) => {
    try {
      const response = await markNotificationReadAPI(notificationId);

      if (response.status === 'success') {
        setSuccessMessage('Notification marked as read');
        await fetchNotifications();
        await fetchStats();
      }
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
      setError(err.message || 'Failed to mark notification as read');
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get type color
  const getTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'system':
        return 'primary';
      case 'gift':
        return 'success';
      case 'topup':
        return 'info';
      case 'withdraw':
        return 'warning';
      case 'stream':
        return 'secondary';
      default:
        return 'default';
    }
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'critical':
        return 'error';
      case 'high':
        return 'warning';
      case 'medium':
        return 'info';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  if (error) {
    return (
      <MainCard title="Notifications Management" content={false}>
        <Box sx={{ p: 3 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      </MainCard>
    );
  }

  return (
    <MainCard title="Notifications Management" content={false}>
      {/* Statistics Cards */}
      <Box sx={{ p: 3, pb: 2 }}>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: 'primary.lighter' }}>
              <CardContent sx={{ p: 2 }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <NotificationOutlined style={{ fontSize: '24px', color: '#1976d2' }} />
                  <Box>
                    <Typography variant="h6" color="primary">
                      {statsLoading ? '-' : stats?.totalNotifications?.toLocaleString() || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Notifications
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: 'warning.lighter' }}>
              <CardContent sx={{ p: 2 }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <BellOutlined style={{ fontSize: '24px', color: '#ed6c02' }} />
                  <Box>
                    <Typography variant="h6" color="warning.main">
                      {statsLoading ? '-' : stats?.unreadNotifications?.toLocaleString() || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Unread
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: 'success.lighter' }}>
              <CardContent sx={{ p: 2 }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <CheckOutlined style={{ fontSize: '24px', color: '#2e7d32' }} />
                  <Box>
                    <Typography variant="h6" color="success.main">
                      {statsLoading ? '-' : stats?.readNotifications?.toLocaleString() || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Read
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: 'info.lighter' }}>
              <CardContent sx={{ p: 2 }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <MessageOutlined style={{ fontSize: '24px', color: '#0288d1' }} />
                  <Box>
                    <Typography variant="h6" color="info.main">
                      {statsLoading ? '-' : stats?.notificationsToday?.toLocaleString() || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Today
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Action Buttons */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item>
            <Button
              variant="contained"
              startIcon={<PlusOutlined />}
              onClick={() => setCreateDialog(prev => ({ ...prev, open: true }))}
            >
              Create Notification
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              startIcon={<GlobalOutlined />}
              onClick={() => setBroadcastDialog(prev => ({ ...prev, open: true }))}
            >
              Broadcast Notification
            </Button>
          </Grid>
        </Grid>

        {/* Filter Section */}
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Type</InputLabel>
              <Select
                value={tempFilters.type}
                label="Type"
                onChange={(e) => setTempFilters(prev => ({ ...prev, type: e.target.value }))}
                startAdornment={<FilterOutlined style={{ marginRight: 8, color: '#666' }} />}
              >
                {TYPE_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              size="small"
              label="User ID"
              value={tempFilters.userId}
              onChange={(e) => setTempFilters(prev => ({ ...prev, userId: e.target.value }))}
              placeholder="Enter user ID"
              InputProps={{
                startAdornment: <UserOutlined style={{ marginRight: 8, color: '#666' }} />
              }}
            />
          </Grid>

          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Read Status</InputLabel>
              <Select
                value={tempFilters.read}
                label="Read Status"
                onChange={(e) => setTempFilters(prev => ({ ...prev, read: e.target.value }))}
              >
                {READ_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={3}>
            <Stack direction="row" spacing={1}>
              <Button variant="contained" onClick={handleSearch} startIcon={<SearchOutlined />} disabled={loading}>
                Search
              </Button>
              <Button variant="outlined" onClick={handleClearFilters} disabled={loading}>
                Clear
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Box>

      {/* Notifications Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Read Status</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : notifications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    No notifications found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              notifications.map((notification) => (
                <TableRow key={notification._id} hover>
                  <TableCell>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Avatar sx={{ width: 32, height: 32 }}>
                        {notification.userId?.name?.charAt(0) || 'U'}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight={500}>
                          {notification.userId?.name || 'Unknown User'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {notification.userId?.email || 'N/A'}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="subtitle2" fontWeight={600}>
                        {notification.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {notification.content?.substring(0, 100)}
                        {notification.content?.length > 100 && '...'}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={notification.type}
                      size="small"
                      color={getTypeColor(notification.type)}
                      sx={{ textTransform: 'capitalize', fontWeight: 500 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={notification.metadata?.priority || 'medium'}
                      size="small"
                      color={getPriorityColor(notification.metadata?.priority)}
                      sx={{ textTransform: 'capitalize', fontWeight: 500 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={notification.read ? 'Read' : 'Unread'}
                      size="small"
                      color={notification.read ? 'success' : 'warning'}
                      sx={{ fontWeight: 500 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatDate(notification.createdAt)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={0.5}>
                      {!notification.read && (
                        <Tooltip title="Mark as Read">
                          <IconButton
                            size="small"
                            color="success"
                            onClick={() => handleMarkAsRead(notification._id)}
                          >
                            <CheckOutlined style={{ fontSize: '16px' }} />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteNotification(notification._id)}
                        >
                          <DeleteOutlined style={{ fontSize: '16px' }} />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {pagination && (
        <TablePagination
          component="div"
          count={pagination.total || 0}
          page={(pagination.current || 1) - 1}
          onPageChange={handlePageChange}
          rowsPerPage={pagination.limit || 10}
          onRowsPerPageChange={handleRowsPerPageChange}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      )}

      {/* Create Notification Dialog */}
      <Dialog
        open={createDialog.open}
        onClose={() => setCreateDialog(prev => ({ ...prev, open: false }))}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Create Notification</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="User ID"
              value={createDialog.data.userId}
              onChange={(e) => setCreateDialog(prev => ({
                ...prev,
                data: { ...prev.data, userId: e.target.value }
              }))}
              placeholder="Enter user ID"
              required
            />
            
            <TextField
              fullWidth
              label="Title"
              value={createDialog.data.title}
              onChange={(e) => setCreateDialog(prev => ({
                ...prev,
                data: { ...prev.data, title: e.target.value }
              }))}
              placeholder="Enter notification title"
              required
            />
            
            <TextField
              fullWidth
              label="Content"
              value={createDialog.data.content}
              onChange={(e) => setCreateDialog(prev => ({
                ...prev,
                data: { ...prev.data, content: e.target.value }
              }))}
              placeholder="Enter notification content"
              multiline
              rows={4}
              required
            />
            
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={createDialog.data.type}
                    label="Type"
                    onChange={(e) => setCreateDialog(prev => ({
                      ...prev,
                      data: { ...prev.data, type: e.target.value }
                    }))}
                  >
                    {NOTIFICATION_TYPES.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={createDialog.data.priority}
                    label="Priority"
                    onChange={(e) => setCreateDialog(prev => ({
                      ...prev,
                      data: { ...prev.data, priority: e.target.value }
                    }))}
                  >
                    {PRIORITY_LEVELS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setCreateDialog(prev => ({ ...prev, open: false }))}
            disabled={createDialog.loading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleCreateNotification}
            variant="contained"
            disabled={createDialog.loading}
          >
            {createDialog.loading ? 'Creating...' : 'Create Notification'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Broadcast Notification Dialog */}
      <Dialog
        open={broadcastDialog.open}
        onClose={() => setBroadcastDialog(prev => ({ ...prev, open: false }))}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Broadcast Notification</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Title"
              value={broadcastDialog.data.title}
              onChange={(e) => setBroadcastDialog(prev => ({
                ...prev,
                data: { ...prev.data, title: e.target.value }
              }))}
              placeholder="Enter broadcast title"
              required
            />
            
            <TextField
              fullWidth
              label="Content"
              value={broadcastDialog.data.content}
              onChange={(e) => setBroadcastDialog(prev => ({
                ...prev,
                data: { ...prev.data, content: e.target.value }
              }))}
              placeholder="Enter broadcast content"
              multiline
              rows={4}
              required
            />
            
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={broadcastDialog.data.type}
                    label="Type"
                    onChange={(e) => setBroadcastDialog(prev => ({
                      ...prev,
                      data: { ...prev.data, type: e.target.value }
                    }))}
                  >
                    {NOTIFICATION_TYPES.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={broadcastDialog.data.priority}
                    label="Priority"
                    onChange={(e) => setBroadcastDialog(prev => ({
                      ...prev,
                      data: { ...prev.data, priority: e.target.value }
                    }))}
                  >
                    {PRIORITY_LEVELS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            
            <Divider />
            
            <Typography variant="subtitle2" fontWeight={600}>
              Target Audience
            </Typography>
            
            <Stack direction="row" spacing={2} alignItems="center">
              <Button
                variant={broadcastDialog.data.targetAll ? "contained" : "outlined"}
                onClick={() => setBroadcastDialog(prev => ({
                  ...prev,
                  data: { ...prev.data, targetAll: true }
                }))}
              >
                All Users
              </Button>
              <Button
                variant={!broadcastDialog.data.targetAll ? "contained" : "outlined"}
                onClick={() => setBroadcastDialog(prev => ({
                  ...prev,
                  data: { ...prev.data, targetAll: false }
                }))}
              >
                Specific Users
              </Button>
            </Stack>
            
            {!broadcastDialog.data.targetAll && (
              <TextField
                fullWidth
                label="Target User IDs"
                value={broadcastDialog.data.targetUserIds.join(', ')}
                onChange={(e) => setBroadcastDialog(prev => ({
                  ...prev,
                  data: { 
                    ...prev.data, 
                    targetUserIds: e.target.value.split(',').map(id => id.trim()).filter(id => id)
                  }
                }))}
                placeholder="Enter user IDs separated by comma"
                helperText="Enter comma-separated user IDs"
              />
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setBroadcastDialog(prev => ({ ...prev, open: false }))}
            disabled={broadcastDialog.loading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleCreateBroadcast}
            variant="contained"
            disabled={broadcastDialog.loading}
            startIcon={<SendOutlined />}
          >
            {broadcastDialog.loading ? 'Broadcasting...' : 'Send Broadcast'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Message */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage('')}
        message={successMessage}
      />
    </MainCard>
  );
} 