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
import TextField from '@mui/material/TextField';
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

// project imports
import MainCard from 'components/MainCard';
import { getWithdrawRequestsAPI, updateWithdrawRequestStatusAPI } from 'api';

// assets
import SendOutlined from '@ant-design/icons/SendOutlined';
import SearchOutlined from '@ant-design/icons/SearchOutlined';
import FilterOutlined from '@ant-design/icons/FilterOutlined';
import UserOutlined from '@ant-design/icons/UserOutlined';
import DollarOutlined from '@ant-design/icons/DollarOutlined';
import { IconButton, Snackbar } from '@mui/material';
import { CheckOutlined, CloseOutlined, EditOutlined, RollbackOutlined } from '@ant-design/icons';

// ==============================|| WITHDRAW REQUESTS PAGE ||============================== //

const STATUS_OPTIONS = [
  { value: '', label: 'All Status' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'completed', label: 'Completed' }
];

export default function WithdrawRequestsPage() {
  const [successMessage, setSuccessMessage] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filter states
  const [filters, setFilters] = useState({
    userId: '',
    status: '',
    page: 1,
    limit: 10
  });

  // Temporary filter states for form
  const [tempFilters, setTempFilters] = useState({
    userId: '',
    status: ''
  });

  useEffect(() => {
    fetchWithdrawRequests();
  }, [filters]);

  const fetchWithdrawRequests = async () => {
    try {
      setLoading(true);
      setError('');

      // Prepare params - always include page and limit
      const params = {
        page: filters.page,
        limit: filters.limit
      };

      // Add optional filters
      if (filters.userId) params.userId = filters.userId;
      if (filters.status) params.status = filters.status;

      const response = await getWithdrawRequestsAPI(params);

      if (response.status === 'success' && response.data) {
        setTransactions(response.data.transactions || []);
        setPagination(response.data.pagination || null);
      }
    } catch (err) {
      console.error('Failed to fetch withdraw requests:', err);
      setError(err.message || 'Failed to load withdraw requests');
    } finally {
      setLoading(false);
    }
  };

  // Handle filter form submission
  const handleSearch = () => {
    setFilters((prev) => ({
      ...prev,
      userId: tempFilters.userId,
      status: tempFilters.status,
      page: 1 // Reset to first page when filtering
    }));
  };

  // Handle clear filters
  const handleClearFilters = () => {
    setTempFilters({ userId: '', status: '' });
    setFilters({ userId: '', status: '', page: 1, limit: 10 });
  };

  // Handle pagination
  const handlePageChange = (event, newPage) => {
    setFilters((prev) => ({
      ...prev,
      page: newPage + 1 // TablePagination uses 0-based indexing
    }));
  };

  const handleRowsPerPageChange = (event) => {
    setFilters((prev) => ({
      ...prev,
      limit: parseInt(event.target.value, 10),
      page: 1
    }));
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount || 0);
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'warning';
      case 'approved':
        return 'info';
      case 'completed':
        return 'success';
      case 'rejected':
        return 'error';
      default:
        return 'default';
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

  // Calculate summary stats
  const summaryStats = {
    total: pagination?.total || 0,
    totalAmount: transactions.reduce((sum, tx) => sum + (tx.amount || 0), 0),
    pending: transactions.filter((tx) => tx.status === 'pending').length,
    completed: transactions.filter((tx) => tx.status === 'completed').length
  };
  const handleStatusUpdate = async (transactionId, newStatus) => {
    // Update local state immediately for better UX
    setTransactions((prevTransactions) =>
      prevTransactions.map((transaction) => (transaction._id === transactionId ? { ...transaction, status: newStatus } : transaction))
    );

    // Show success message
    setSuccessMessage(`Transaction status updated to ${newStatus} successfully`);

    // Optionally refresh data to ensure consistency
    // await fetchUsers();
  };
  const EditableStatusCell = ({ transaction, onStatusUpdate }) => {
    const [transactionStatus, setTransactionStatus] = useState(transaction.status);
    const [isEditing, setIsEditing] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const handleEdit = () => {
      setIsEditing(true);
    };

    const handleCancel = () => {
      setIsEditing(false);
    };

    const handleApprove = async () => {
      try {
        setIsUpdating(true);
        await updateWithdrawRequestStatusAPI(transaction._id, 'approved', 'Đã duyệt yêu cầu rút tiền');
        onStatusUpdate(transaction._id, 'approved');
        setIsEditing(false);
        setTransactionStatus('approved');
        setSuccessMessage(`Transaction status updated to approved successfully`);
      } catch (error) {
        console.error('Failed to update status:', error);
        // Reset to original status on error
      } finally {
        setIsUpdating(false);
      }
    };
    const handleReject = async () => {
      try {
        setIsUpdating(true);
        await updateWithdrawRequestStatusAPI(transaction._id, 'rejected', 'Đã từ chối yêu cầu rút tiền');
        onStatusUpdate(transaction._id, 'rejected');
        setIsEditing(false);
        setTransactionStatus('rejected');
        setSuccessMessage(`Transaction status updated to rejected successfully`);
      } catch (error) {
        console.error('Failed to update status:', error);
        // Reset to original status on error
      } finally {
        setIsUpdating(false);
      }
    };

    if (transactionStatus === 'pending') {
      if (isEditing) {
        return (
          <Stack direction="row" spacing={1} alignItems="center">
            <Tooltip title="Approve">
              <IconButton size="small" color="success" onClick={handleApprove} disabled={isUpdating}>
                {isUpdating ? <CircularProgress size={16} /> : <CheckOutlined />}
              </IconButton>
            </Tooltip>

            <Tooltip title="Reject">
              <IconButton size="small" color="error" onClick={handleReject} disabled={isUpdating}>
                {isUpdating ? <CircularProgress size={16} /> : <CloseOutlined />}
              </IconButton>
            </Tooltip>

            <Tooltip title="Back">
              <IconButton size="small" color="primary" onClick={handleCancel}>
                <RollbackOutlined />
              </IconButton>
            </Tooltip>
          </Stack>
        );
      }
      return (
        <Tooltip title="Edit Approve">
          <IconButton onClick={handleEdit} size="small" variant="outlined" color="primary">
            <EditOutlined style={{ fontSize: '14px' }} />
          </IconButton>
        </Tooltip>
      );
    }
  };

  if (error) {
    return (
      <MainCard title="Withdraw Requests Management" content={false}>
        <Box sx={{ p: 3 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      </MainCard>
    );
  }

  return (
    <MainCard title="Withdraw Requests Management" content={false}>
      {/* Summary Cards */}
      <Box sx={{ p: 3, pb: 2 }}>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: 'error.lighter' }}>
              <CardContent sx={{ p: 2 }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <SendOutlined style={{ fontSize: '24px', color: '#d32f2f' }} />
                  <Box>
                    <Typography variant="h6" color="error">
                      {summaryStats.total}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Requests
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
                  <DollarOutlined style={{ fontSize: '24px', color: '#ed6c02' }} />
                  <Box>
                    <Typography variant="h6" color="warning.main">
                      {formatCurrency(summaryStats.totalAmount).replace('₫', '')}₫
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Amount
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
                  <SendOutlined style={{ fontSize: '24px', color: '#ed6c02' }} />
                  <Box>
                    <Typography variant="h6" color="warning.main">
                      {summaryStats.pending}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Pending
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
                  <SendOutlined style={{ fontSize: '24px', color: '#2e7d32' }} />
                  <Box>
                    <Typography variant="h6" color="success.main">
                      {summaryStats.completed}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Completed
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
            <TextField
              fullWidth
              size="small"
              label="Search by User ID"
              value={tempFilters.userId}
              onChange={(e) => setTempFilters((prev) => ({ ...prev, userId: e.target.value }))}
              placeholder="Enter user ID"
              InputProps={{
                startAdornment: <UserOutlined style={{ marginRight: 8, color: '#666' }} />
              }}
            />
          </Grid>

          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={tempFilters.status}
                label="Status"
                onChange={(e) => setTempFilters((prev) => ({ ...prev, status: e.target.value }))}
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

        {/* Active Filters Display */}
        {(filters.userId || filters.status) && (
          <Box sx={{ mt: 2 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="body2" color="text.secondary">
                Active filters:
              </Typography>
              {filters.userId && (
                <Chip
                  label={`User ID: ${filters.userId}`}
                  size="small"
                  variant="outlined"
                  onDelete={() => setFilters((prev) => ({ ...prev, userId: '', page: 1 }))}
                />
              )}
              {filters.status && (
                <Chip
                  label={`Status: ${filters.status}`}
                  size="small"
                  variant="outlined"
                  onDelete={() => setFilters((prev) => ({ ...prev, status: '', page: 1 }))}
                />
              )}
            </Stack>
          </Box>
        )}
      </Box>

      {/* Loading State */}
      {loading && (
        <Box sx={{ p: 4, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <CircularProgress />
        </Box>
      )}

      {/* Transactions Table */}
      {!loading && (
        <>
          <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
            <Table sx={{ minWidth: 650 }} aria-label="withdraw requests table">
              <TableHead>
                <TableRow>
                  <TableCell>Transaction ID</TableCell>
                  <TableCell>User</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Note</TableCell>
                  <TableCell>Created At</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    {/* Transaction ID */}
                    <TableCell>
                      <Tooltip title={transaction._id}>
                        <Typography variant="body2" fontWeight={500}>
                          {transaction._id.slice(-8)}
                        </Typography>
                      </Tooltip>
                    </TableCell>

                    {/* User Info */}
                    <TableCell>
                      <Box>
                        <Typography variant="subtitle2" fontWeight={600}>
                          {transaction.userId?.name || 'Unknown User'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {transaction.userId?.email || 'N/A'}
                        </Typography>
                      </Box>
                    </TableCell>

                    {/* Amount */}
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight={600} color="error.main">
                        -{formatCurrency(transaction.amount)}
                      </Typography>
                    </TableCell>

                    {/* Type */}
                    <TableCell>
                      <Chip
                        label={transaction.type}
                        size="small"
                        color="error"
                        variant="outlined"
                        sx={{ textTransform: 'uppercase', fontWeight: 500 }}
                      />
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <Chip
                        label={transaction.status}
                        size="small"
                        color={getStatusColor(transaction.status)}
                        sx={{ textTransform: 'capitalize', fontWeight: 500 }}
                      />
                    </TableCell>

                    {/* Description */}
                    <TableCell>
                      <Tooltip title={transaction.description}>
                        <Typography
                          variant="body2"
                          sx={{
                            maxWidth: 200,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {transaction.description || 'N/A'}
                        </Typography>
                      </Tooltip>
                    </TableCell>

                    {/* Note */}
                    <TableCell>
                      <Tooltip title={transaction.note}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            maxWidth: 150,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {transaction.note || 'N/A'}
                        </Typography>
                      </Tooltip>
                    </TableCell>

                    {/* Created At */}
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(transaction.createdAt)}
                      </Typography>
                    </TableCell>

                    {/* Action */}
                    <TableCell>
                      <EditableStatusCell transaction={transaction} onStatusUpdate={handleStatusUpdate} />
                    </TableCell>
                  </TableRow>
                ))}

                {transactions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                      <Typography variant="body2" color="text.secondary">
                        No withdraw requests found
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          {pagination && pagination.total > 0 && (
            <TablePagination
              component="div"
              count={pagination.total}
              page={filters.page - 1} // Convert to 0-based indexing
              onPageChange={handlePageChange}
              rowsPerPage={filters.limit}
              onRowsPerPageChange={handleRowsPerPageChange}
              rowsPerPageOptions={[5, 10, 25, 50, 100]}
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} of ${count !== -1 ? count : `more than ${to}`}`}
              labelRowsPerPage="Rows per page:"
            />
          )}
        </>
      )}

      {/* Success Snackbar */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setSuccessMessage('')} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>
    </MainCard>
  );
}
