import PropTypes from 'prop-types';
import { useRef, useState, useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import ButtonBase from '@mui/material/ButtonBase';
import CardContent from '@mui/material/CardContent';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';

// project imports
import ProfileTab from './ProfileTab';
import SettingTab from './SettingTab';
import Avatar from 'components/@extended/Avatar';
import MainCard from 'components/MainCard';
import Transitions from 'components/@extended/Transitions';
import IconButton from 'components/@extended/IconButton';
import { getUserProfileAPI, logoutAPI, isAuthenticated, getToken } from 'api';

// assets
import LogoutOutlined from '@ant-design/icons/LogoutOutlined';
import SettingOutlined from '@ant-design/icons/SettingOutlined';
import UserOutlined from '@ant-design/icons/UserOutlined';
import avatar1 from 'assets/images/users/avatar-1.png';

// tab panel wrapper
function TabPanel({ children, value, index, ...other }) {
  return (
    <div role="tabpanel" hidden={value !== index} id={`profile-tabpanel-${index}`} aria-labelledby={`profile-tab-${index}`} {...other}>
      {value === index && children}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `profile-tab-${index}`,
    'aria-controls': `profile-tabpanel-${index}`
  };
}

// ==============================|| HEADER CONTENT - PROFILE ||============================== //

export default function Profile() {
  const theme = useTheme();

  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(0);
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Load user profile on component mount
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        setIsLoading(true);
        setError('');
        
        // Kiểm tra có token không
        const token = getToken();
        
        if (!token) {
          setError('No authentication token found');
          return;
        }

        if (!isAuthenticated()) {
          setError('User not authenticated');
          return;
        }

        const response = await getUserProfileAPI();
        
        if (response.status === 'success' && response.data) {
          setUserProfile(response.data);
        }
      } catch (err) {
        console.error('Failed to load user profile:', err);
        setError(err.message || 'Failed to load profile');
        
        // Nếu lỗi 401, redirect về login
        if (err.status === 401) {
          logoutAPI();
          window.location.href = '/app/login';
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadUserProfile();
  }, []);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleLogout = () => {
    logoutAPI();
    window.location.href = '/app/login';
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

  if (isLoading) {
    return (
      <Box sx={{ flexShrink: 0, ml: 0.75 }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  return (
    <Box sx={{ flexShrink: 0, ml: 0.75 }}>
      <ButtonBase
        sx={(theme) => ({
          p: 0.25,
          bgcolor: open ? 'grey.100' : 'transparent',
          borderRadius: 1,
          '&:hover': { bgcolor: 'secondary.lighter' },
          '&:focus-visible': { outline: `2px solid ${theme.palette.secondary.dark}`, outlineOffset: 2 },
          ...theme.applyStyles('dark', { bgcolor: open ? 'background.default' : 'transparent', '&:hover': { bgcolor: 'secondary.light' } })
        })}
        aria-label="open profile"
        ref={anchorRef}
        aria-controls={open ? 'profile-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
      >
        <Stack direction="row" sx={{ gap: 1.25, alignItems: 'center', p: 0.5 }}>
          <Avatar 
            alt="profile user" 
            src={userProfile?.avatar || avatar1} 
            size="sm" 
          />
          <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
            {userProfile?.name || 'Loading...'}
          </Typography>
        </Stack>
      </ButtonBase>
      <Popper
        placement="bottom-end"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, 9]
              }
            }
          ]
        }}
      >
        {({ TransitionProps }) => (
          <Transitions type="grow" position="top-right" in={open} {...TransitionProps}>
            <Paper sx={(theme) => ({ boxShadow: theme.customShadows.z1, width: 290, minWidth: 240, maxWidth: { xs: 250, md: 290 } })}>
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard elevation={0} border={false} content={false}>
                  <CardContent sx={{ px: 2.5, pt: 3 }}>
                    <Grid container justifyContent="space-between" alignItems="center">
                      <Grid>
                        <Stack direction="row" sx={{ gap: 1.25, alignItems: 'center' }}>
                          <Avatar 
                            alt="profile user" 
                            src={userProfile?.avatar || avatar1} 
                            sx={{ width: 32, height: 32 }} 
                          />
                          <Stack>
                            <Typography variant="h6">{userProfile?.name || 'User'}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {userProfile?.email || 'email@example.com'}
                            </Typography>
                            <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                              <Chip 
                                label={userProfile?.role || 'user'} 
                                size="small" 
                                color={getRoleColor(userProfile?.role)}
                                sx={{ textTransform: 'capitalize' }}
                              />
                              {userProfile?.balance !== undefined && (
                                <Chip 
                                  label={formatCurrency(userProfile.balance)} 
                                  size="small" 
                                  color="success"
                                  variant="outlined"
                                />
                              )}
                            </Stack>
                          </Stack>
                        </Stack>
                      </Grid>
                      <Grid>
                        <Tooltip title="Logout">
                          <IconButton size="large" sx={{ color: 'text.primary' }} onClick={handleLogout}>
                            <LogoutOutlined />
                          </IconButton>
                        </Tooltip>
                      </Grid>
                    </Grid>
                  </CardContent>

                  <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs variant="fullWidth" value={value} onChange={handleChange} aria-label="profile tabs">
                      <Tab
                        sx={{
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'center',
                          alignItems: 'center',
                          textTransform: 'capitalize',
                          gap: 1.25,
                          '& .MuiTab-icon': {
                            marginBottom: 0
                          }
                        }}
                        icon={<UserOutlined />}
                        label="Profile"
                        {...a11yProps(0)}
                      />
                      <Tab
                        sx={{
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'center',
                          alignItems: 'center',
                          textTransform: 'capitalize',
                          gap: 1.25,
                          '& .MuiTab-icon': {
                            marginBottom: 0
                          }
                        }}
                        icon={<SettingOutlined />}
                        label="Setting"
                        {...a11yProps(1)}
                      />
                    </Tabs>
                  </Box>
                  <TabPanel value={value} index={0} dir={theme.direction}>
                    <ProfileTab userProfile={userProfile} />
                  </TabPanel>
                  <TabPanel value={value} index={1} dir={theme.direction}>
                    <SettingTab userProfile={userProfile} />
                  </TabPanel>
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
    </Box>
  );
}

TabPanel.propTypes = { children: PropTypes.node, value: PropTypes.number, index: PropTypes.number, other: PropTypes.any };
