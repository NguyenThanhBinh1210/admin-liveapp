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
import Avatar from '@mui/material/Avatar';

// project imports
import MainCard from 'components/MainCard';
import { getGiftsAPI } from 'api';

// assets
import GiftOutlined from '@ant-design/icons/GiftOutlined';
import SearchOutlined from '@ant-design/icons/SearchOutlined';
import FilterOutlined from '@ant-design/icons/FilterOutlined';
import StarOutlined from '@ant-design/icons/StarOutlined';
import DollarOutlined from '@ant-design/icons/DollarOutlined';
import CreateGift from './create-gift';
import { EditOutlined } from '@ant-design/icons';
import { IconButton } from '@mui/material';
import EditGift from './edit-gift';

// ==============================|| GIFTS PAGE ||============================== //

const ACTIVE_OPTIONS = [
  { value: '', label: 'All Status' },
  { value: 'true', label: 'Active' },
  { value: 'false', label: 'Inactive' }
];

export default function GiftsPage() {
  const [gifts, setGifts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filter states
  const [filters, setFilters] = useState({
    isActive: '',
    page: 1,
    limit: 10
  });

  // Temporary filter states for form
  const [tempFilters, setTempFilters] = useState({
    isActive: ''
  });

  useEffect(() => {
    fetchGifts();
  }, [filters]);

  const fetchGifts = async () => {
    try {
      setLoading(true);
      setError('');

      // Prepare params - always include page and limit
      const params = {
        page: filters.page,
        limit: filters.limit
      };

      // Add optional filters
      if (filters.isActive !== '') {
        params.isActive = filters.isActive === 'true';
      }

      const response = await getGiftsAPI(params);

      if (response.status === 'success' && response.data) {
        setGifts(response.data.gifts || []);
        setTotal(response.data.total || 0);
      }
    } catch (err) {
      console.error('Failed to fetch gifts:', err);
      setError(err.message || 'Failed to load gifts');
    } finally {
      setLoading(false);
    }
  };

  // Handle filter form submission
  const handleSearch = () => {
    setFilters((prev) => ({
      ...prev,
      isActive: tempFilters.isActive,
      page: 1 // Reset to first page when filtering
    }));
  };

  // Handle clear filters
  const handleClearFilters = () => {
    setTempFilters({ isActive: '' });
    setFilters({ isActive: '', page: 1, limit: 10 });
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
    total: total || 0,
    active: gifts.filter((gift) => gift.isActive).length,
    inactive: gifts.filter((gift) => !gift.isActive).length,
    totalValue: gifts.reduce((sum, gift) => sum + (gift.value || 0), 0)
  };

  if (error) {
    return (
      <MainCard title="Gifts Management" content={false}>
        <Box sx={{ p: 3 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      </MainCard>
    );
  }

  return (
    <MainCard title="Gifts Management" content={false}>
      {/* Summary Cards */}
      <Box sx={{ p: 3, pb: 2 }}>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: 'secondary.lighter' }}>
              <CardContent sx={{ p: 2 }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <GiftOutlined style={{ fontSize: '24px', color: '#9c27b0' }} />
                  <Box>
                    <Typography variant="h6" color="secondary">
                      {summaryStats.total}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Gifts
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
                  <StarOutlined style={{ fontSize: '24px', color: '#2e7d32' }} />
                  <Box>
                    <Typography variant="h6" color="success.main">
                      {summaryStats.active}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Active Gifts
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: 'grey.100' }}>
              <CardContent sx={{ p: 2 }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <GiftOutlined style={{ fontSize: '24px', color: '#757575' }} />
                  <Box>
                    <Typography variant="h6" color="text.secondary">
                      {summaryStats.inactive}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Inactive Gifts
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
                      {formatCurrency(summaryStats.totalValue).replace('₫', '')}₫
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Value
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
                value={tempFilters.isActive}
                label="Status"
                onChange={(e) => setTempFilters((prev) => ({ ...prev, isActive: e.target.value }))}
                startAdornment={<FilterOutlined style={{ marginRight: 8, color: '#666' }} />}
              >
                {ACTIVE_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Stack direction="row" spacing={1}>
              <Button variant="contained" onClick={handleSearch} startIcon={<SearchOutlined />} disabled={loading}>
                Search
              </Button>
              <Button variant="outlined" onClick={handleClearFilters} disabled={loading}>
                Clear
              </Button>
              <CreateGift />
            </Stack>
          </Grid>
        </Grid>

        {/* Active Filters Display */}
        {filters.isActive && (
          <Box sx={{ mt: 2 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="body2" color="text.secondary">
                Active filters:
              </Typography>
              {filters.isActive && (
                <Chip
                  label={`Status: ${filters.isActive === 'true' ? 'Active' : 'Inactive'}`}
                  size="small"
                  variant="outlined"
                  onDelete={() => setFilters((prev) => ({ ...prev, isActive: '', page: 1 }))}
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

      {/* Gifts Table */}
      {!loading && (
        <>
          <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
            <Table sx={{ minWidth: 650 }} aria-label="gifts table">
              <TableHead>
                <TableRow>
                  <TableCell>Image</TableCell>
                  <TableCell>Gift Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell align="right">Value</TableCell>
                  <TableCell align="center">Sort Order</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell>Created At</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {gifts.map((gift) => (
                  <TableRow key={gift._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    {/* Image */}
                    <TableCell>
                      <Avatar
                        src={gift.imageUrl}
                        alt={gift.name}
                        sx={{
                          width: 40,
                          height: 40,
                          bgcolor: 'secondary.lighter'
                        }}
                      >
                        <GiftOutlined />
                      </Avatar>
                    </TableCell>

                    {/* Gift Name */}
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>
                        {gift.name}
                      </Typography>
                    </TableCell>

                    {/* Description */}
                    <TableCell>
                      <Tooltip title={gift.description}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            maxWidth: 250,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {gift.description || 'N/A'}
                        </Typography>
                      </Tooltip>
                    </TableCell>

                    {/* Value */}
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight={600} color="secondary.main">
                        {formatCurrency(gift.value)}
                      </Typography>
                    </TableCell>

                    {/* Sort Order */}
                    <TableCell align="center">
                      <Chip label={gift.sortOrder} size="small" variant="outlined" sx={{ fontWeight: 500 }} />
                    </TableCell>

                    {/* Status */}
                    <TableCell align="center">
                      <Chip
                        label={gift.isActive ? 'Active' : 'Inactive'}
                        size="small"
                        color={gift.isActive ? 'success' : 'default'}
                        sx={{ textTransform: 'capitalize', fontWeight: 500 }}
                      />
                    </TableCell>

                    {/* Created At */}
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(gift.createdAt)}
                      </Typography>
                    </TableCell>

                    {/* Action */}
                    <TableCell>
                      <EditGift gift={gift} />
                    </TableCell>
                  </TableRow>
                ))}

                {gifts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <Typography variant="body2" color="text.secondary">
                        No gifts found
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          {total > 0 && (
            <TablePagination
              component="div"
              count={total}
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
    </MainCard>
  );
}
