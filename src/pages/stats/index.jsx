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
import Divider from '@mui/material/Divider';

// project imports
import MainCard from 'components/MainCard';
import { getStatsAPI } from 'api/auth';

// assets
import UserOutlined from '@ant-design/icons/UserOutlined';
import DollarOutlined from '@ant-design/icons/DollarOutlined';
import GiftOutlined from '@ant-design/icons/GiftOutlined';
import BarChartOutlined from '@ant-design/icons/BarChartOutlined';

// ==============================|| STATS PAGE ||============================== //

export default function StatsPage() {
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await getStatsAPI();
      
      if (response.status === 'success' && response.data) {
        setStatsData(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
      setError(err.message || 'Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount || 0);
  };

  if (error) {
    return (
      <MainCard title="Platform Statistics" content={false}>
        <Box sx={{ p: 3 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      </MainCard>
    );
  }

  if (loading) {
    return (
      <MainCard title="Platform Statistics" content={false}>
        <Box sx={{ p: 4, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <CircularProgress />
        </Box>
      </MainCard>
    );
  }

  return (
    <MainCard title="Platform Statistics" content={false}>
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <BarChartOutlined style={{ fontSize: '28px', color: '#1976d2' }} />
            <Box>
              <Typography variant="h5" fontWeight={600}>
                System Analytics
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Real-time platform statistics and metrics
              </Typography>
            </Box>
          </Stack>
        </Box>

        <Divider sx={{ mb: 4 }} />

        {/* Main Statistics Cards */}
        <Grid container spacing={4} sx={{ mb: 4 }}>
          {/* Active Users */}
          <Grid item xs={12} sm={6} md={4}>
            <Card 
              sx={{ 
                bgcolor: 'primary.lighter', 
                height: '100%',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Stack spacing={3}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Box 
                      sx={{ 
                        p: 2, 
                        borderRadius: 3, 
                        bgcolor: 'primary.main',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: 2
                      }}
                    >
                      <UserOutlined style={{ fontSize: '28px', color: '#fff' }} />
                    </Box>
                    <Typography variant="h3" fontWeight={700} color="primary.main">
                      {statsData?.activeUsers?.toLocaleString() || '0'}
                    </Typography>
                  </Stack>
                  
                  <Box>
                    <Typography variant="h6" color="primary.main" fontWeight={600} gutterBottom>
                      Active Users
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Currently active users on the platform
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Total Balance */}
          <Grid item xs={12} sm={6} md={4}>
            <Card 
              sx={{ 
                bgcolor: 'success.lighter', 
                height: '100%',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Stack spacing={3}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Box 
                      sx={{ 
                        p: 2, 
                        borderRadius: 3, 
                        bgcolor: 'success.main',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: 2
                      }}
                    >
                      <DollarOutlined style={{ fontSize: '28px', color: '#fff' }} />
                    </Box>
                    <Stack alignItems="flex-end">
                      <Typography variant="h4" fontWeight={700} color="success.main">
                        {formatCurrency(statsData?.totalBalance).replace('₫', '')}
                      </Typography>
                      <Typography variant="h6" color="success.main">
                        ₫
                      </Typography>
                    </Stack>
                  </Stack>
                  
                  <Box>
                    <Typography variant="h6" color="success.main" fontWeight={600} gutterBottom>
                      Total Balance
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Combined balance across all user accounts
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Gift Count */}
          <Grid item xs={12} sm={6} md={4}>
            <Card 
              sx={{ 
                bgcolor: 'secondary.lighter', 
                height: '100%',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Stack spacing={3}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Box 
                      sx={{ 
                        p: 2, 
                        borderRadius: 3, 
                        bgcolor: 'secondary.main',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: 2
                      }}
                    >
                      <GiftOutlined style={{ fontSize: '28px', color: '#fff' }} />
                    </Box>
                    <Typography variant="h3" fontWeight={700} color="secondary.main">
                      {statsData?.giftCount?.toLocaleString() || '0'}
                    </Typography>
                  </Stack>
                  
                  <Box>
                    <Typography variant="h6" color="secondary.main" fontWeight={600} gutterBottom>
                      Available Gifts
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total number of gifts available in the system
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Summary Section */}
        <Card sx={{ bgcolor: 'grey.50' }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Platform Overview
            </Typography>
            
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} md={4}>
                <Stack spacing={1}>
                  <Typography variant="subtitle2" color="text.secondary">
                    User Engagement
                  </Typography>
                  <Typography variant="body2">
                    • <strong>{statsData?.activeUsers || 0}</strong> users currently active
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active user participation on the platform
                  </Typography>
                </Stack>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Stack spacing={1}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Financial Overview
                  </Typography>
                  <Typography variant="body2">
                    • <strong>{formatCurrency(statsData?.totalBalance)}</strong> total platform balance
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Combined user balances across all accounts
                  </Typography>
                </Stack>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Stack spacing={1}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Gift System
                  </Typography>
                  <Typography variant="body2">
                    • <strong>{statsData?.giftCount || 0}</strong> gifts available for users
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Virtual gifts that users can send to each other
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </MainCard>
  );
} 