import PropTypes from 'prop-types';

// material-ui
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';

// project imports
import { logoutAPI } from 'api';

// assets
import EditOutlined from '@ant-design/icons/EditOutlined';
import ProfileOutlined from '@ant-design/icons/ProfileOutlined';
import LogoutOutlined from '@ant-design/icons/LogoutOutlined';
import UserOutlined from '@ant-design/icons/UserOutlined';
import WalletOutlined from '@ant-design/icons/WalletOutlined';
import MailOutlined from '@ant-design/icons/MailOutlined';
import CalendarOutlined from '@ant-design/icons/CalendarOutlined';
import CrownOutlined from '@ant-design/icons/CrownOutlined';

// ==============================|| HEADER PROFILE - PROFILE TAB ||============================== //

export default function ProfileTab({ userProfile }) {
  const handleLogout = () => {
    logoutAPI();
    window.location.href = '/app/login';
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
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
      case 'user':
        return 'primary';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ p: 0 }}>
      {/* User Information Section */}
      {userProfile && (
        <>
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>User Information</Typography>
            
            <Stack spacing={1.5}>
              {/* Name */}
              <Stack direction="row" alignItems="center" spacing={1}>
                <UserOutlined style={{ fontSize: '16px', color: '#666' }} />
                <Typography variant="body2" color="text.secondary" sx={{ minWidth: 60 }}>
                  Name:
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {userProfile.name || 'N/A'}
                </Typography>
              </Stack>

              {/* Email */}
              <Stack direction="row" alignItems="center" spacing={1}>
                <MailOutlined style={{ fontSize: '16px', color: '#666' }} />
                <Typography variant="body2" color="text.secondary" sx={{ minWidth: 60 }}>
                  Email:
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {userProfile.email || 'N/A'}
                </Typography>
              </Stack>

              {/* Role */}
              <Stack direction="row" alignItems="center" spacing={1}>
                <CrownOutlined style={{ fontSize: '16px', color: '#666' }} />
                <Typography variant="body2" color="text.secondary" sx={{ minWidth: 60 }}>
                  Role:
                </Typography>
                <Chip 
                  label={userProfile.role || 'user'} 
                  size="small" 
                  color={getRoleColor(userProfile.role)}
                  sx={{ textTransform: 'capitalize', height: 20 }}
                />
              </Stack>

              {/* Balance */}
              {userProfile.balance !== undefined && (
                <Stack direction="row" alignItems="center" spacing={1}>
                  <WalletOutlined style={{ fontSize: '16px', color: '#666' }} />
                  <Typography variant="body2" color="text.secondary" sx={{ minWidth: 60 }}>
                    Balance:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500, color: 'success.main' }}>
                    {formatCurrency(userProfile.balance)}
                  </Typography>
                </Stack>
              )}

              {/* Status */}
              <Stack direction="row" alignItems="center" spacing={1}>
                <ProfileOutlined style={{ fontSize: '16px', color: '#666' }} />
                <Typography variant="body2" color="text.secondary" sx={{ minWidth: 60 }}>
                  Status:
                </Typography>
                <Chip 
                  label={userProfile.isActive ? 'Active' : 'Inactive'} 
                  size="small" 
                  color={userProfile.isActive ? 'success' : 'error'}
                  variant="outlined"
                  sx={{ height: 20 }}
                />
              </Stack>

              {/* Created Date */}
              <Stack direction="row" alignItems="center" spacing={1}>
                <CalendarOutlined style={{ fontSize: '16px', color: '#666' }} />
                <Typography variant="body2" color="text.secondary" sx={{ minWidth: 60 }}>
                  Joined:
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {formatDate(userProfile.createdAt)}
                </Typography>
              </Stack>
            </Stack>
          </Box>
          
          <Divider />
        </>
      )}

      {/* Menu Actions */}
      <List component="nav" sx={{ p: 0, '& .MuiListItemIcon-root': { minWidth: 32 } }}>
        <ListItemButton onClick={handleLogout}>
          <ListItemIcon>
            <LogoutOutlined />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </List>
    </Box>
  );
}

ProfileTab.propTypes = { 
  userProfile: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    role: PropTypes.string,
    balance: PropTypes.number,
    avatar: PropTypes.string,
    isActive: PropTypes.bool,
    createdAt: PropTypes.string,
    updatedAt: PropTypes.string
  })
};
