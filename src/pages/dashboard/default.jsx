import { useState, useEffect } from 'react';

// material-ui
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

// project imports
import { getDashboardStatsAPI } from 'api/auth';

// assets
import UserOutlined from '@ant-design/icons/UserOutlined';
import TransactionOutlined from '@ant-design/icons/TransactionOutlined';
import WalletOutlined from '@ant-design/icons/WalletOutlined';
import SendOutlined from '@ant-design/icons/SendOutlined';

// ==============================|| DASHBOARD - DEFAULT ||============================== //

export default function DashboardDefault() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await getDashboardStatsAPI();
      
      if (response.status === 'success' && response.data) {
        setDashboardData(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch dashboard stats:', err);
      setError(err.message || 'Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ p: 4, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      {/* Header */}
      <Grid item xs={12}>
        <Typography variant="h4" fontWeight={600}>
          Dashboard Overview
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
          System statistics and key metrics
        </Typography>
      </Grid>

      {/* Statistics Cards */}
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ bgcolor: 'primary.lighter', height: '100%' }}>
          <CardContent sx={{ p: 3 }}>
            <Stack spacing={2}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Box 
                  sx={{ 
                    p: 1.5, 
                    borderRadius: 2, 
                    bgcolor: 'primary.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <UserOutlined style={{ fontSize: '24px', color: '#fff' }} />
                </Box>
                <Typography variant="h6" color="primary.main" fontWeight={600}>
                  Total Users
                </Typography>
              </Stack>
              
              <Typography variant="h3" fontWeight={700} color="primary.main">
                {dashboardData?.userCount?.toLocaleString() || '0'}
              </Typography>
              
              <Typography variant="body2" color="text.secondary">
                Registered users in the system
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ bgcolor: 'success.lighter', height: '100%' }}>
          <CardContent sx={{ p: 3 }}>
            <Stack spacing={2}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Box 
                  sx={{ 
                    p: 1.5, 
                    borderRadius: 2, 
                    bgcolor: 'success.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <TransactionOutlined style={{ fontSize: '24px', color: '#fff' }} />
                </Box>
                <Typography variant="h6" color="success.main" fontWeight={600}>
                  Total Transactions
                </Typography>
              </Stack>
              
              <Typography variant="h3" fontWeight={700} color="success.main">
                {dashboardData?.totalTransactions?.toLocaleString() || '0'}
              </Typography>
              
              <Typography variant="body2" color="text.secondary">
                All transactions processed
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ bgcolor: 'warning.lighter', height: '100%' }}>
          <CardContent sx={{ p: 3 }}>
            <Stack spacing={2}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Box 
                  sx={{ 
                    p: 1.5, 
                    borderRadius: 2, 
                    bgcolor: 'warning.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <WalletOutlined style={{ fontSize: '24px', color: '#fff' }} />
                </Box>
                <Typography variant="h6" color="warning.main" fontWeight={600}>
                  Pending Top-ups
                </Typography>
              </Stack>
              
              <Typography variant="h3" fontWeight={700} color="warning.main">
                {dashboardData?.pendingTopups?.toLocaleString() || '0'}
              </Typography>
              
              <Typography variant="body2" color="text.secondary">
                Top-up requests awaiting approval
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ bgcolor: 'error.lighter', height: '100%' }}>
          <CardContent sx={{ p: 3 }}>
            <Stack spacing={2}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Box 
                  sx={{ 
                    p: 1.5, 
                    borderRadius: 2, 
                    bgcolor: 'error.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <SendOutlined style={{ fontSize: '24px', color: '#fff' }} />
                </Box>
                <Typography variant="h6" color="error.main" fontWeight={600}>
                  Pending Withdraws
                </Typography>
              </Stack>
              
              <Typography variant="h3" fontWeight={700} color="error.main">
                {dashboardData?.pendingWithdraws?.toLocaleString() || '0'}
              </Typography>
              
              <Typography variant="body2" color="text.secondary">
                Withdraw requests awaiting approval
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      {/* Quick Links */}
      <Grid item xs={12}>
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Quick Actions
            </Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Box 
                  sx={{ 
                    p: 2, 
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                      bgcolor: 'primary.lighter',
                      borderColor: 'primary.main'
                    }
                  }}
                >
                  <UserOutlined style={{ fontSize: '32px', color: '#1976d2' }} />
                  <Typography variant="subtitle2" sx={{ mt: 1 }}>
                    Manage Users
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box 
                  sx={{ 
                    p: 2, 
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                      bgcolor: 'warning.lighter',
                      borderColor: 'warning.main'
                    }
                  }}
                >
                  <WalletOutlined style={{ fontSize: '32px', color: '#ed6c02' }} />
                  <Typography variant="subtitle2" sx={{ mt: 1 }}>
                    Top-up Requests
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box 
                  sx={{ 
                    p: 2, 
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                      bgcolor: 'error.lighter',
                      borderColor: 'error.main'
                    }
                  }}
                >
                  <SendOutlined style={{ fontSize: '32px', color: '#d32f2f' }} />
                  <Typography variant="subtitle2" sx={{ mt: 1 }}>
                    Withdraw Requests
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box 
                  sx={{ 
                    p: 2, 
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                      bgcolor: 'secondary.lighter',
                      borderColor: 'secondary.main'
                    }
                  }}
                >
                  <TransactionOutlined style={{ fontSize: '32px', color: '#9c27b0' }} />
                  <Typography variant="subtitle2" sx={{ mt: 1 }}>
                    System Config
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
