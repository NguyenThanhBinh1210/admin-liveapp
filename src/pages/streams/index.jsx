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

// project imports
import MainCard from 'components/MainCard';
import { getStreamsAdminAPI, endStreamAdminAPI, updateStreamStatusAPI } from 'api';

// assets
import VideoCameraOutlined from '@ant-design/icons/VideoCameraOutlined';
import SearchOutlined from '@ant-design/icons/SearchOutlined';
import FilterOutlined from '@ant-design/icons/FilterOutlined';
import UserOutlined from '@ant-design/icons/UserOutlined';
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import StopOutlined from '@ant-design/icons/StopOutlined';
import PlayCircleOutlined from '@ant-design/icons/PlayCircleOutlined';
import PauseCircleOutlined from '@ant-design/icons/PauseCircleOutlined';
import DollarOutlined from '@ant-design/icons/DollarOutlined';
import GiftOutlined from '@ant-design/icons/GiftOutlined';
import ClockCircleOutlined from '@ant-design/icons/ClockCircleOutlined';

// ==============================|| STREAMS MANAGEMENT PAGE ||============================== //

const STATUS_OPTIONS = [
  { value: '', label: 'All Status' },
  { value: 'live', label: 'Live' },
  { value: 'ended', label: 'Ended' },
  { value: 'scheduled', label: 'Scheduled' }
];

const STREAM_ACTIONS = [
  { value: 'end', label: 'End Stream', color: 'error' },
  { value: 'pause', label: 'Pause Stream', color: 'warning' },
  { value: 'warn', label: 'Warn Streamer', color: 'info' }
];

export default function StreamsPage() {
  const [streams, setStreams] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Filter states
  const [filters, setFilters] = useState({
    status: '',
    streamerId: '',
    page: 1,
    limit: 10
  });

  // Temporary filter states for form
  const [tempFilters, setTempFilters] = useState({
    status: '',
    streamerId: ''
  });

  // Action dialog states
  const [actionDialog, setActionDialog] = useState({
    open: false,
    stream: null,
    action: '',
    reason: '',
    adminNote: '',
    loading: false
  });

  useEffect(() => {
    fetchStreams();
  }, [filters]);

  const fetchStreams = async () => {
    try {
      setLoading(true);
      setError('');

      // Prepare params - always include page and limit
      const params = {
        page: filters.page,
        limit: filters.limit
      };

      // Add optional filters
      if (filters.status) params.status = filters.status;
      if (filters.streamerId) params.streamerId = filters.streamerId;

      const response = await getStreamsAdminAPI(params);

      if (response.status === 'success' && response.data) {
        setStreams(response.data.streams || []);
        setPagination(response.data.pagination || null);
      }
    } catch (err) {
      console.error('Failed to fetch streams:', err);
      setError(err.message || 'Failed to load streams');
    } finally {
      setLoading(false);
    }
  };

  // Handle filter form submission
  const handleSearch = () => {
    setFilters(prev => ({
      ...prev,
      status: tempFilters.status,
      streamerId: tempFilters.streamerId,
      page: 1 // Reset to first page when filtering
    }));
  };

  // Handle clear filters
  const handleClearFilters = () => {
    setTempFilters({ status: '', streamerId: '' });
    setFilters({ status: '', streamerId: '', page: 1, limit: 10 });
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

  // Handle stream action
  const handleStreamAction = (stream, action) => {
    setActionDialog({
      open: true,
      stream,
      action,
      reason: '',
      adminNote: '',
      loading: false
    });
  };

  // Execute stream action
  const executeStreamAction = async () => {
    if (!actionDialog.stream || !actionDialog.action) return;

    try {
      setActionDialog(prev => ({ ...prev, loading: true }));

      const data = {
        reason: actionDialog.reason,
        adminNote: actionDialog.adminNote
      };

      let response;
      if (actionDialog.action === 'end') {
        response = await endStreamAdminAPI(actionDialog.stream._id, data);
      } else {
        response = await updateStreamStatusAPI(actionDialog.stream._id, {
          ...data,
          status: actionDialog.action
        });
      }

      if (response.status === 'success') {
        setSuccessMessage(`Stream ${actionDialog.action} successfully`);
        setActionDialog({ open: false, stream: null, action: '', reason: '', adminNote: '', loading: false });
        await fetchStreams(); // Refresh data
      }
    } catch (err) {
      console.error('Failed to execute stream action:', err);
      setError(err.message || 'Failed to execute action');
    } finally {
      setActionDialog(prev => ({ ...prev, loading: false }));
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount || 0);
  };

  // Format duration
  const formatDuration = (seconds) => {
    if (!seconds) return 'N/A';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
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

  // Get status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'live':
        return 'success';
      case 'ended':
        return 'default';
      case 'scheduled':
        return 'info';
      default:
        return 'default';
    }
  };

  // Calculate summary stats
  const summaryStats = {
    total: streams.length,
    live: streams.filter(s => s.status === 'live').length,
    ended: streams.filter(s => s.status === 'ended').length,
    scheduled: streams.filter(s => s.status === 'scheduled').length
  };

  if (error) {
    return (
      <MainCard title="Streams Management" content={false}>
        <Box sx={{ p: 3 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      </MainCard>
    );
  }

  return (
    <MainCard title="Streams Management" content={false}>
      {/* Summary Cards */}
      <Box sx={{ p: 3, pb: 2 }}>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: 'primary.lighter' }}>
              <CardContent sx={{ p: 2 }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <VideoCameraOutlined style={{ fontSize: '24px', color: '#1976d2' }} />
                  <Box>
                    <Typography variant="h6" color="primary">
                      {summaryStats.total}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Streams
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
                  <PlayCircleOutlined style={{ fontSize: '24px', color: '#2e7d32' }} />
                  <Box>
                    <Typography variant="h6" color="success.main">
                      {summaryStats.live}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Live Streams
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
                  <StopOutlined style={{ fontSize: '24px', color: '#ed6c02' }} />
                  <Box>
                    <Typography variant="h6" color="warning.main">
                      {summaryStats.ended}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Ended Streams
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
                  <ClockCircleOutlined style={{ fontSize: '24px', color: '#0288d1' }} />
                  <Box>
                    <Typography variant="h6" color="info.main">
                      {summaryStats.scheduled}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Scheduled
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Filter Section */}
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={tempFilters.status}
                label="Status"
                onChange={(e) => setTempFilters(prev => ({ ...prev, status: e.target.value }))}
                startAdornment={<FilterOutlined style={{ marginRight: 8, color: '#666' }} />}
              >
                {STATUS_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              size="small"
              label="Streamer ID"
              value={tempFilters.streamerId}
              onChange={(e) => setTempFilters(prev => ({ ...prev, streamerId: e.target.value }))}
              placeholder="Enter streamer ID"
              InputProps={{
                startAdornment: <UserOutlined style={{ marginRight: 8, color: '#666' }} />
              }}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
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

      {/* Streams Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Stream Info</TableCell>
              <TableCell>Streamer</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Viewers</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Revenue</TableCell>
              <TableCell>Started At</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : streams.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    No streams found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              streams.map((stream) => (
                <TableRow key={stream._id} hover>
                  <TableCell>
                    <Box>
                      <Typography variant="subtitle2" fontWeight={600}>
                        {stream.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {stream.description}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Avatar sx={{ width: 32, height: 32 }}>
                        {stream.streamer?.name?.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight={500}>
                          {stream.streamer?.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {stream.streamer?.email}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={stream.status}
                      size="small"
                      color={getStatusColor(stream.status)}
                      sx={{ textTransform: 'capitalize', fontWeight: 500 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <EyeOutlined style={{ fontSize: '16px', color: '#666' }} />
                      <Typography variant="body2">
                        {stream.viewerCount?.toLocaleString() || 0}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatDuration(stream.duration)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Stack spacing={0.5}>
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <DollarOutlined style={{ fontSize: '14px', color: '#666' }} />
                        <Typography variant="body2">
                          {formatCurrency(stream.revenue)}
                        </Typography>
                      </Stack>
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <GiftOutlined style={{ fontSize: '14px', color: '#666' }} />
                        <Typography variant="caption" color="text.secondary">
                          {stream.giftCount || 0} gifts
                        </Typography>
                      </Stack>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatDate(stream.startedAt)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={0.5}>
                      {stream.status === 'live' && (
                        <Tooltip title="End Stream">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleStreamAction(stream, 'end')}
                          >
                            <StopOutlined style={{ fontSize: '16px' }} />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title="Warn Streamer">
                        <IconButton
                          size="small"
                          color="warning"
                          onClick={() => handleStreamAction(stream, 'warn')}
                        >
                          <FilterOutlined style={{ fontSize: '16px' }} />
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
          page={(pagination.page || 1) - 1}
          onPageChange={handlePageChange}
          rowsPerPage={pagination.limit || 10}
          onRowsPerPageChange={handleRowsPerPageChange}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      )}

      {/* Action Dialog */}
      <Dialog
        open={actionDialog.open}
        onClose={() => setActionDialog(prev => ({ ...prev, open: false }))}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {actionDialog.action === 'end' ? 'End Stream' : 
           actionDialog.action === 'warn' ? 'Warn Streamer' : 'Stream Action'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Stream: {actionDialog.stream?.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Streamer: {actionDialog.stream?.streamer?.name}
            </Typography>
            
            <TextField
              fullWidth
              label="Reason"
              value={actionDialog.reason}
              onChange={(e) => setActionDialog(prev => ({ ...prev, reason: e.target.value }))}
              placeholder="Enter reason for this action"
              required
            />
            
            <TextField
              fullWidth
              label="Admin Note"
              value={actionDialog.adminNote}
              onChange={(e) => setActionDialog(prev => ({ ...prev, adminNote: e.target.value }))}
              placeholder="Internal admin note"
              multiline
              rows={3}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setActionDialog(prev => ({ ...prev, open: false }))}
            disabled={actionDialog.loading}
          >
            Cancel
          </Button>
          <Button 
            onClick={executeStreamAction}
            variant="contained"
            disabled={actionDialog.loading || !actionDialog.reason}
            color={actionDialog.action === 'end' ? 'error' : 'warning'}
          >
            {actionDialog.loading ? 'Processing...' : 'Confirm'}
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