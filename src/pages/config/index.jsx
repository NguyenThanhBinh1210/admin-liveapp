import { useState, useEffect } from 'react';

// material-ui
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';

// project imports
import MainCard from 'components/MainCard';
import { getConfigAPI, updateConfigAPI } from 'api/auth';

// assets
import SettingOutlined from '@ant-design/icons/SettingOutlined';
import DollarOutlined from '@ant-design/icons/DollarOutlined';
import BankOutlined from '@ant-design/icons/BankOutlined';
import PercentageOutlined from '@ant-design/icons/PercentageOutlined';
import GiftOutlined from '@ant-design/icons/GiftOutlined';
import InfoCircleOutlined from '@ant-design/icons/InfoCircleOutlined';
import EditOutlined from '@ant-design/icons/EditOutlined';
import SaveOutlined from '@ant-design/icons/SaveOutlined';
import CloseOutlined from '@ant-design/icons/CloseOutlined';

// ==============================|| CONFIG PAGE ||============================== //

export default function ConfigPage() {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({
    minTopup: '',
    maxWithdraw: '',
    commissionRate: '',
    giftBonusRate: ''
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await getConfigAPI();
      
      if (response.status === 'success' && response.data) {
        setConfig(response.data);
        // Update form data when config loads
        setFormData({
          minTopup: response.data.minTopup || '',
          maxWithdraw: response.data.maxWithdraw || '',
          commissionRate: response.data.commissionRate || '',
          giftBonusRate: response.data.giftBonusRate || ''
        });
      }
    } catch (err) {
      console.error('Failed to fetch config:', err);
      setError(err.message || 'Failed to load config');
    } finally {
      setLoading(false);
    }
  };

  // Handle edit mode
  const handleEdit = () => {
    setIsEditing(true);
    setFormErrors({});
    setFormData({
      minTopup: config?.minTopup || '',
      maxWithdraw: config?.maxWithdraw || '',
      commissionRate: config?.commissionRate || '',
      giftBonusRate: config?.giftBonusRate || ''
    });
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormErrors({});
    setFormData({
      minTopup: config?.minTopup || '',
      maxWithdraw: config?.maxWithdraw || '',
      commissionRate: config?.commissionRate || '',
      giftBonusRate: config?.giftBonusRate || ''
    });
  };

  // Handle form input change
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Validate form data
  const validateForm = () => {
    const errors = {};
    
    if (!formData.minTopup || isNaN(formData.minTopup) || Number(formData.minTopup) < 0) {
      errors.minTopup = 'Minimum top-up must be a valid positive number';
    }
    
    if (!formData.maxWithdraw || isNaN(formData.maxWithdraw) || Number(formData.maxWithdraw) < 0) {
      errors.maxWithdraw = 'Maximum withdraw must be a valid positive number';
    }
    
    if (!formData.commissionRate || isNaN(formData.commissionRate) || Number(formData.commissionRate) < 0 || Number(formData.commissionRate) > 100) {
      errors.commissionRate = 'Commission rate must be between 0 and 100';
    }
    
    if (!formData.giftBonusRate || isNaN(formData.giftBonusRate) || Number(formData.giftBonusRate) < 0 || Number(formData.giftBonusRate) > 100) {
      errors.giftBonusRate = 'Gift bonus rate must be between 0 and 100';
    }
    
    if (Number(formData.minTopup) >= Number(formData.maxWithdraw)) {
      errors.minTopup = 'Minimum top-up must be less than maximum withdraw';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle save config
  const handleSaveConfig = async () => {
    if (!validateForm()) {
      return;
    }
    
    try {
      setSaving(true);
      setError('');
      
      const configData = {
        minTopup: Number(formData.minTopup),
        maxWithdraw: Number(formData.maxWithdraw),
        commissionRate: Number(formData.commissionRate),
        giftBonusRate: Number(formData.giftBonusRate)
      };
      
      const response = await updateConfigAPI(configData);
      
      if (response.status === 'success' && response.data) {
        setConfig(response.data.config);
        setIsEditing(false);
        setSuccessMessage(response.data.message || 'Configuration updated successfully');
      }
    } catch (err) {
      console.error('Failed to update config:', err);
      setError(err.message || 'Failed to update configuration');
    } finally {
      setSaving(false);
    }
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

  if (error) {
    return (
      <MainCard title="System Configuration" content={false}>
        <Box sx={{ p: 3 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      </MainCard>
    );
  }

  if (loading) {
    return (
      <MainCard title="System Configuration" content={false}>
        <Box sx={{ p: 4, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <CircularProgress />
        </Box>
      </MainCard>
    );
  }

  return (
    <MainCard title="System Configuration" content={false}>
      <Box sx={{ p: 3 }}>
        {/* Header Info */}
        <Box sx={{ mb: 3 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" alignItems="center" spacing={2}>
              <SettingOutlined style={{ fontSize: '28px', color: '#1976d2' }} />
              <Box>
                <Typography variant="h5" fontWeight={600}>
                  Platform Settings
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  System-wide configuration parameters
                </Typography>
              </Box>
            </Stack>
            
            {/* Edit Controls */}
            <Stack direction="row" spacing={1}>
              {!isEditing ? (
                <Button
                  variant="contained"
                  startIcon={<EditOutlined />}
                  onClick={handleEdit}
                  disabled={loading}
                >
                  Edit Configuration
                </Button>
              ) : (
                <>
                  <Button
                    variant="contained"
                    startIcon={<SaveOutlined />}
                    onClick={handleSaveConfig}
                    disabled={saving}
                    color="success"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<CloseOutlined />}
                    onClick={handleCancelEdit}
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                </>
              )}
            </Stack>
          </Stack>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Configuration Cards */}
        <Grid container spacing={3}>
          {/* Min Topup */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: 'success.lighter', height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Stack spacing={2}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Box 
                      sx={{ 
                        p: 1, 
                        borderRadius: 1, 
                        bgcolor: 'success.main',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <DollarOutlined style={{ fontSize: '20px', color: '#fff' }} />
                    </Box>
                    <Typography variant="h6" color="success.main" fontWeight={600}>
                      Min Top-up
                    </Typography>
                  </Stack>
                  
                  {isEditing ? (
                    <TextField
                      fullWidth
                      type="number"
                      value={formData.minTopup}
                      onChange={(e) => handleInputChange('minTopup', e.target.value)}
                      error={!!formErrors.minTopup}
                      helperText={formErrors.minTopup}
                      size="small"
                      inputProps={{ min: 0 }}
                    />
                  ) : (
                    <Typography variant="h4" fontWeight={700} color="success.main">
                      {formatCurrency(config?.minTopup)}
                    </Typography>
                  )}
                  
                  <Typography variant="body2" color="text.secondary">
                    Minimum amount for top-up transactions
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Max Withdraw */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: 'warning.lighter', height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Stack spacing={2}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Box 
                      sx={{ 
                        p: 1, 
                        borderRadius: 1, 
                        bgcolor: 'warning.main',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <BankOutlined style={{ fontSize: '20px', color: '#fff' }} />
                    </Box>
                    <Typography variant="h6" color="warning.main" fontWeight={600}>
                      Max Withdraw
                    </Typography>
                  </Stack>
                  
                  {isEditing ? (
                    <TextField
                      fullWidth
                      type="number"
                      value={formData.maxWithdraw}
                      onChange={(e) => handleInputChange('maxWithdraw', e.target.value)}
                      error={!!formErrors.maxWithdraw}
                      helperText={formErrors.maxWithdraw}
                      size="small"
                      inputProps={{ min: 0 }}
                    />
                  ) : (
                    <Typography variant="h4" fontWeight={700} color="warning.main">
                      {formatCurrency(config?.maxWithdraw)}
                    </Typography>
                  )}
                  
                  <Typography variant="body2" color="text.secondary">
                    Maximum amount for withdraw transactions
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Commission Rate */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: 'info.lighter', height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Stack spacing={2}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Box 
                      sx={{ 
                        p: 1, 
                        borderRadius: 1, 
                        bgcolor: 'info.main',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <PercentageOutlined style={{ fontSize: '20px', color: '#fff' }} />
                    </Box>
                    <Typography variant="h6" color="info.main" fontWeight={600}>
                      Commission Rate
                    </Typography>
                  </Stack>
                  
                  {isEditing ? (
                    <TextField
                      fullWidth
                      type="number"
                      value={formData.commissionRate}
                      onChange={(e) => handleInputChange('commissionRate', e.target.value)}
                      error={!!formErrors.commissionRate}
                      helperText={formErrors.commissionRate}
                      size="small"
                      inputProps={{ min: 0, max: 100, step: 0.1 }}
                      InputProps={{
                        endAdornment: <Typography>%</Typography>
                      }}
                    />
                  ) : (
                    <Typography variant="h4" fontWeight={700} color="info.main">
                      {config?.commissionRate}%
                    </Typography>
                  )}
                  
                  <Typography variant="body2" color="text.secondary">
                    Platform commission rate for transactions
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Gift Bonus Rate */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: 'secondary.lighter', height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Stack spacing={2}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Box 
                      sx={{ 
                        p: 1, 
                        borderRadius: 1, 
                        bgcolor: 'secondary.main',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <GiftOutlined style={{ fontSize: '20px', color: '#fff' }} />
                    </Box>
                    <Typography variant="h6" color="secondary.main" fontWeight={600}>
                      Gift Bonus Rate
                    </Typography>
                  </Stack>
                  
                  {isEditing ? (
                    <TextField
                      fullWidth
                      type="number"
                      value={formData.giftBonusRate}
                      onChange={(e) => handleInputChange('giftBonusRate', e.target.value)}
                      error={!!formErrors.giftBonusRate}
                      helperText={formErrors.giftBonusRate}
                      size="small"
                      inputProps={{ min: 0, max: 100, step: 0.1 }}
                      InputProps={{
                        endAdornment: <Typography>%</Typography>
                      }}
                    />
                  ) : (
                    <Typography variant="h4" fontWeight={700} color="secondary.main">
                      {config?.giftBonusRate}%
                    </Typography>
                  )}
                  
                  <Typography variant="body2" color="text.secondary">
                    Bonus rate for gift transactions
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* System Information */}
          <Grid item xs={12}>
            <Card sx={{ bgcolor: 'grey.50' }}>
              <CardContent sx={{ p: 3 }}>
                <Stack spacing={2}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <InfoCircleOutlined style={{ fontSize: '24px', color: '#666' }} />
                    <Typography variant="h6" fontWeight={600}>
                      System Information
                    </Typography>
                  </Stack>

                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={3}>
                      <Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Configuration Key
                        </Typography>
                        <Chip 
                          label={config?.key || 'N/A'} 
                          variant="outlined" 
                          sx={{ fontWeight: 500 }}
                        />
                      </Box>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                      <Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Configuration ID
                        </Typography>
                        <Typography variant="body2" fontFamily="monospace">
                          {config?._id?.slice(-8) || 'N/A'}
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                      <Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Created At
                        </Typography>
                        <Typography variant="body2">
                          {formatDate(config?.createdAt)}
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                      <Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Last Updated
                        </Typography>
                        <Typography variant="body2">
                          {formatDate(config?.updatedAt)}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Configuration Details */}
          <Grid item xs={12}>
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Configuration Details
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Stack spacing={2}>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Transaction Limits
                        </Typography>
                        <Typography variant="body2">
                          • Minimum top-up: <strong>{formatCurrency(config?.minTopup)}</strong>
                        </Typography>
                        <Typography variant="body2">
                          • Maximum withdraw: <strong>{formatCurrency(config?.maxWithdraw)}</strong>
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Stack spacing={2}>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Revenue Settings
                        </Typography>
                        <Typography variant="body2">
                          • Platform commission: <strong>{config?.commissionRate}%</strong>
                        </Typography>
                        <Typography variant="body2">
                          • Gift bonus percentage: <strong>{config?.giftBonusRate}%</strong>
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Success Snackbar */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSuccessMessage('')} 
          severity="success" 
          sx={{ width: '100%' }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </MainCard>
  );
} 