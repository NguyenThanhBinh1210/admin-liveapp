import { useState, useEffect } from 'react';

// material-ui
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
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
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Snackbar from '@mui/material/Snackbar';

// project imports
import MainCard from 'components/MainCard';
import { getUsersAPI, updateUserRoleAPI } from 'api';

// assets
import UserOutlined from '@ant-design/icons/UserOutlined';
import SearchOutlined from '@ant-design/icons/SearchOutlined';
import FilterOutlined from '@ant-design/icons/FilterOutlined';
import EditOutlined from '@ant-design/icons/EditOutlined';
import CheckOutlined from '@ant-design/icons/CheckOutlined';
import CloseOutlined from '@ant-design/icons/CloseOutlined';

// ==============================|| USERS PAGE ||============================== //

const ROLE_OPTIONS = [
  { value: '', label: 'All Roles' },
  { value: 'user', label: 'User' },
  { value: 'admin', label: 'Admin' },
  { value: 'superadmin', label: 'Super Admin' },
  { value: 'moderator', label: 'Moderator' },
  { value: 'staff', label: 'Staff' },
  { value: 'streamer', label: 'Streamer' }
];

const EDITABLE_ROLES = [
  { value: 'user', label: 'User' },
  { value: 'admin', label: 'Admin' },
  { value: 'superadmin', label: 'Super Admin' },
  { value: 'moderator', label: 'Moderator' },
  { value: 'staff', label: 'Staff' },
  { value: 'streamer', label: 'Streamer' }
];

// Editable Role Cell Component
function EditableRoleCell({ user, onRoleUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedRole, setSelectedRole] = useState(user.role);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
    setSelectedRole(user.role);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSelectedRole(user.role);
  };

  const handleSave = async () => {
    if (selectedRole === user.role) {
      setIsEditing(false);
      return;
    }

    try {
      setIsUpdating(true);
      await updateUserRoleAPI(user._id, selectedRole);
      await onRoleUpdate(user._id, selectedRole);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update role:', error);
      // Reset to original role on error
      setSelectedRole(user.role);
    } finally {
      setIsUpdating(false);
    }
  };

  // Get role color
  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'superadmin':
        return 'error';
      case 'admin':
        return 'warning';
      case 'moderator':
        return 'info';
      case 'streamer':
        return 'success';
      case 'staff':
        return 'secondary';
      case 'user':
        return 'primary';
      default:
        return 'default';
    }
  };

  if (isEditing) {
    return (
      <Stack direction="row" spacing={1} alignItems="center">
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <Select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            disabled={isUpdating}
          >
            {EDITABLE_ROLES.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <Tooltip title="Save">
          <IconButton 
            size="small" 
            onClick={handleSave}
            disabled={isUpdating}
            color="success"
          >
            {isUpdating ? <CircularProgress size={16} /> : <CheckOutlined />}
          </IconButton>
        </Tooltip>
        
        <Tooltip title="Cancel">
          <IconButton 
            size="small" 
            onClick={handleCancel}
            disabled={isUpdating}
            color="error"
          >
            <CloseOutlined />
          </IconButton>
        </Tooltip>
      </Stack>
    );
  }

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Chip
        label={user.role}
        size="small"
        color={getRoleColor(user.role)}
        sx={{ textTransform: 'capitalize', fontWeight: 500 }}
      />
      <Tooltip title="Edit Role">
        <IconButton size="small" onClick={handleEdit} color="primary">
          <EditOutlined style={{ fontSize: '14px' }} />
        </IconButton>
      </Tooltip>
    </Stack>
  );
}

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Filter states
  const [filters, setFilters] = useState({
    email: '',
    role: '',
    page: 1,
    limit: 10
  });

  // Temporary filter states for form
  const [tempFilters, setTempFilters] = useState({
    email: '',
    role: ''
  });

  useEffect(() => {
    fetchUsers();
  }, [filters]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Prepare params - always include page and limit
      const params = {
        page: filters.page,
        limit: filters.limit
      };
      
      // Add optional filters
      if (filters.email) params.email = filters.email;
      if (filters.role) params.role = filters.role;
      
      const response = await getUsersAPI(params);
      
      if (response.status === 'success' && response.data) {
        setUsers(response.data.users || []);
        setPagination(response.data.pagination || null);
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  // Handle role update
  const handleRoleUpdate = async (userId, newRole) => {
    // Update local state immediately for better UX
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user._id === userId ? { ...user, role: newRole } : user
      )
    );
    
    // Show success message
    setSuccessMessage(`User role updated to ${newRole} successfully`);
    
    // Optionally refresh data to ensure consistency
    // await fetchUsers();
  };

  // Handle filter form submission
  const handleSearch = () => {
    setFilters(prev => ({
      ...prev,
      email: tempFilters.email,
      role: tempFilters.role,
      page: 1 // Reset to first page when filtering
    }));
  };

  // Handle clear filters
  const handleClearFilters = () => {
    setTempFilters({ email: '', role: '' });
    setFilters({ email: '', role: '', page: 1, limit: 10 });
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

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount || 0);
  };

  // Get role color
  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'superadmin':
        return 'error';
      case 'admin':
        return 'warning';
      case 'moderator':
        return 'info';
      case 'streamer':
        return 'success';
      case 'staff':
        return 'secondary';
      case 'user':
        return 'primary';
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

  if (error) {
    return (
      <MainCard title="Users Management" content={false}>
        <Box sx={{ p: 3 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      </MainCard>
    );
  }

  return (
    <MainCard title="Users Management" content={false}>
      {/* Filter Section */}
      <Box sx={{ p: 3, pb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              size="small"
              label="Search by Email"
              value={tempFilters.email}
              onChange={(e) => setTempFilters(prev => ({ ...prev, email: e.target.value }))}
              placeholder="Enter email address"
              InputProps={{
                startAdornment: <SearchOutlined style={{ marginRight: 8, color: '#666' }} />
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Role</InputLabel>
              <Select
                value={tempFilters.role}
                label="Role"
                onChange={(e) => setTempFilters(prev => ({ ...prev, role: e.target.value }))}
                startAdornment={<FilterOutlined style={{ marginRight: 8, color: '#666' }} />}
              >
                {ROLE_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={3}>
            <Stack direction="row" spacing={1}>
              <Button
                variant="contained"
                onClick={handleSearch}
                startIcon={<SearchOutlined />}
                disabled={loading}
              >
                Search
              </Button>
              <Button
                variant="outlined"
                onClick={handleClearFilters}
                disabled={loading}
              >
                Clear
              </Button>
            </Stack>
          </Grid>
          
          <Grid item xs={12} sm={2}>
            <Stack direction="row" spacing={1} alignItems="center" justifyContent="flex-end">
              <UserOutlined style={{ fontSize: '16px', color: '#666' }} />
              <Typography variant="body2" color="text.secondary">
                Total:
              </Typography>
              <Typography variant="h6" color="primary">
                {pagination?.total || users.length}
              </Typography>
            </Stack>
          </Grid>
        </Grid>

        {/* Active Filters Display */}
        {(filters.email || filters.role) && (
          <Box sx={{ mt: 2 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="body2" color="text.secondary">
                Active filters:
              </Typography>
              {filters.email && (
                <Chip
                  label={`Email: ${filters.email}`}
                  size="small"
                  variant="outlined"
                  onDelete={() => setFilters(prev => ({ ...prev, email: '', page: 1 }))}
                />
              )}
              {filters.role && (
                <Chip
                  label={`Role: ${filters.role}`}
                  size="small"
                  variant="outlined"
                  onDelete={() => setFilters(prev => ({ ...prev, role: '', page: 1 }))}
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

      {/* Users Table */}
      {!loading && (
        <>
          <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
            <Table sx={{ minWidth: 650 }} aria-label="users table">
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell align="right">Balance</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell>Created At</TableCell>
                  <TableCell>Updated At</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow
                    key={user._id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    {/* User Info */}
                    <TableCell>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar
                          src={user.avatar}
                          alt={user.name}
                          sx={{ width: 40, height: 40 }}
                        >
                          {user.name?.charAt(0)?.toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" fontWeight={600}>
                            {user.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ID: {user._id.slice(-8)}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>

                    {/* Email */}
                    <TableCell>
                      <Typography variant="body2">
                        {user.email}
                      </Typography>
                    </TableCell>

                    {/* Role - Editable */}
                    <TableCell>
                      <EditableRoleCell user={user} onRoleUpdate={handleRoleUpdate} />
                    </TableCell>

                    {/* Balance */}
                    <TableCell align="right">
                      <Typography 
                        variant="body2" 
                        fontWeight={600}
                        color={user.balance > 0 ? 'success.main' : 'text.secondary'}
                      >
                        {formatCurrency(user.balance)}
                      </Typography>
                    </TableCell>

                    {/* Status */}
                    <TableCell align="center">
                      <Chip
                        label={user.isActive ? 'Active' : 'Inactive'}
                        size="small"
                        color={user.isActive ? 'success' : 'error'}
                        variant={user.isActive ? 'filled' : 'outlined'}
                      />
                    </TableCell>

                    {/* Created At */}
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(user.createdAt)}
                      </Typography>
                    </TableCell>

                    {/* Updated At */}
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(user.updatedAt)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}

                {users.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <Typography variant="body2" color="text.secondary">
                        No users found
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
              labelDisplayedRows={({ from, to, count }) => 
                `${from}-${to} of ${count !== -1 ? count : `more than ${to}`}`
              }
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