import { useState, useEffect } from 'react';

// material-ui
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import InputAdornment from '@mui/material/InputAdornment';
import Snackbar from '@mui/material/Snackbar';

// project imports
import MainCard from 'components/MainCard';
import { 
  getSupportRoomsAPI, 
  getSupportChatAPI, 
  sendSupportMessageAPI, 
  closeSupportRoomAPI,
  getSupportStatsAPI,
  assignSupportRequestAPI
} from 'api';

// assets
import MessageOutlined from '@ant-design/icons/MessageOutlined';
import SendOutlined from '@ant-design/icons/SendOutlined';
import UserOutlined from '@ant-design/icons/UserOutlined';
import CloseOutlined from '@ant-design/icons/CloseOutlined';
import CheckOutlined from '@ant-design/icons/CheckOutlined';
import ClockCircleOutlined from '@ant-design/icons/ClockCircleOutlined';
import TeamOutlined from '@ant-design/icons/TeamOutlined';
import ExclamationCircleOutlined from '@ant-design/icons/ExclamationCircleOutlined';

// ==============================|| SUPPORT CHAT MANAGEMENT PAGE ||============================== //

export default function SupportPage() {
  const [supportRooms, setSupportRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chatLoading, setChatLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Message input state
  const [messageInput, setMessageInput] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    fetchSupportRooms();
    fetchStats();
  }, []);

  const fetchSupportRooms = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await getSupportRoomsAPI();

      if (response.status === 'success' && response.data) {
        setSupportRooms(response.data.rooms || []);
      }
    } catch (err) {
      console.error('Failed to fetch support rooms:', err);
      setError(err.message || 'Failed to load support rooms');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const response = await getSupportStatsAPI();

      if (response.status === 'success' && response.data) {
        setStats(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch support stats:', err);
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchChatMessages = async (userId) => {
    try {
      setChatLoading(true);
      setError('');

      const response = await getSupportChatAPI(userId, {
        limit: 50,
        order: 'asc'
      });

      if (response.status === 'success' && response.data) {
        setChatMessages(response.data.messages || []);
      }
    } catch (err) {
      console.error('Failed to fetch chat messages:', err);
      setError(err.message || 'Failed to load chat messages');
    } finally {
      setChatLoading(false);
    }
  };

  const handleRoomSelect = (room) => {
    setSelectedRoom(room);
    fetchChatMessages(room.user._id);
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedRoom) return;

    try {
      setSendingMessage(true);

      const messageData = {
        roomId: selectedRoom.roomId,
        message: messageInput.trim(),
        isSupport: true,
        sentBy: 'admin'
      };

      const response = await sendSupportMessageAPI(messageData);

      if (response.status === 'success') {
        setMessageInput('');
        setSuccessMessage('Message sent successfully');
        // Refresh chat messages
        await fetchChatMessages(selectedRoom.user._id);
        // Refresh rooms to update unread count
        await fetchSupportRooms();
      }
    } catch (err) {
      console.error('Failed to send message:', err);
      setError(err.message || 'Failed to send message');
    } finally {
      setSendingMessage(false);
    }
  };

  const handleCloseRoom = async (roomId) => {
    if (!confirm('Are you sure you want to close this support room?')) return;

    try {
      const data = {
        reason: 'Resolved by admin',
        adminNote: 'Support request completed'
      };

      const response = await closeSupportRoomAPI(roomId, data);

      if (response.status === 'success') {
        setSuccessMessage('Support room closed successfully');
        await fetchSupportRooms();
        if (selectedRoom?.roomId === roomId) {
          setSelectedRoom(null);
          setChatMessages([]);
        }
      }
    } catch (err) {
      console.error('Failed to close room:', err);
      setError(err.message || 'Failed to close support room');
    }
  };

  const handleAssignRequest = async (roomId, staffId) => {
    try {
      const data = {
        staffId,
        priority: 'medium'
      };

      const response = await assignSupportRequestAPI(roomId, data);

      if (response.status === 'success') {
        setSuccessMessage('Support request assigned successfully');
        await fetchSupportRooms();
      }
    } catch (err) {
      console.error('Failed to assign request:', err);
      setError(err.message || 'Failed to assign support request');
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

  // Format time for messages
  const formatTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'open':
        return 'success';
      case 'closed':
        return 'default';
      case 'assigned':
        return 'info';
      default:
        return 'primary';
    }
  };

  if (error) {
    return (
      <MainCard title="Support Chat Management" content={false}>
        <Box sx={{ p: 3 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      </MainCard>
    );
  }

  return (
    <MainCard title="Support Chat Management" content={false}>
      {/* Statistics Cards */}
      <Box sx={{ p: 3, pb: 2 }}>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: 'primary.lighter' }}>
              <CardContent sx={{ p: 2 }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <MessageOutlined style={{ fontSize: '24px', color: '#1976d2' }} />
                  <Box>
                    <Typography variant="h6" color="primary">
                      {statsLoading ? '-' : stats?.totalRooms?.toLocaleString() || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Rooms
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
                      {statsLoading ? '-' : stats?.openRooms?.toLocaleString() || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Open Rooms
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
                  <ClockCircleOutlined style={{ fontSize: '24px', color: '#ed6c02' }} />
                  <Box>
                    <Typography variant="h6" color="warning.main">
                      {statsLoading ? '-' : stats?.pendingRequests?.toLocaleString() || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Pending Requests
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
                  <TeamOutlined style={{ fontSize: '24px', color: '#0288d1' }} />
                  <Box>
                    <Typography variant="h6" color="info.main">
                      {statsLoading ? '-' : stats?.assignedRooms?.toLocaleString() || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Assigned
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Chat Interface */}
      <Box sx={{ p: 3, pt: 0 }}>
        <Grid container spacing={2} sx={{ height: '600px' }}>
          {/* Support Rooms List */}
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardHeader
                title="Support Rooms"
                action={
                  <Button
                    size="small"
                    onClick={fetchSupportRooms}
                    disabled={loading}
                  >
                    Refresh
                  </Button>
                }
              />
              <Divider />
              <Box sx={{ height: 'calc(100% - 64px)', overflow: 'auto' }}>
                {loading ? (
                  <Box sx={{ p: 3, textAlign: 'center' }}>
                    <CircularProgress />
                  </Box>
                ) : supportRooms.length === 0 ? (
                  <Box sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      No support rooms found
                    </Typography>
                  </Box>
                ) : (
                  <List>
                    {supportRooms.map((room) => (
                      <ListItem
                        key={room.roomId}
                        button
                        selected={selectedRoom?.roomId === room.roomId}
                        onClick={() => handleRoomSelect(room)}
                        sx={{
                          '&.Mui-selected': {
                            bgcolor: 'primary.lighter'
                          }
                        }}
                      >
                        <ListItemAvatar>
                          <Badge
                            badgeContent={room.unreadCount}
                            color="error"
                            invisible={room.unreadCount === 0}
                          >
                            <Avatar>
                              {room.user?.name?.charAt(0) || 'U'}
                            </Avatar>
                          </Badge>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <Typography variant="subtitle2">
                                {room.user?.name || 'Unknown User'}
                              </Typography>
                              <Chip
                                label={room.status || 'open'}
                                size="small"
                                color={getStatusColor(room.status)}
                                sx={{ fontSize: '0.7rem' }}
                              />
                            </Stack>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary" noWrap>
                                {room.lastMessage?.message || 'No messages'}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {formatTime(room.lastMessage?.sentAt)}
                              </Typography>
                            </Box>
                          }
                        />
                        <Stack direction="column" spacing={0.5}>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCloseRoom(room.roomId);
                            }}
                          >
                            <CloseOutlined style={{ fontSize: '16px' }} />
                          </IconButton>
                        </Stack>
                      </ListItem>
                    ))}
                  </List>
                )}
              </Box>
            </Card>
          </Grid>

          {/* Chat Messages */}
          <Grid item xs={12} md={8}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardHeader
                title={
                  selectedRoom ? (
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Avatar>
                        {selectedRoom.user?.name?.charAt(0) || 'U'}
                      </Avatar>
                      <Box>
                        <Typography variant="h6">
                          {selectedRoom.user?.name || 'Unknown User'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {selectedRoom.user?.email || 'No email'}
                        </Typography>
                      </Box>
                    </Stack>
                  ) : (
                    'Select a support room to view messages'
                  )
                }
              />
              <Divider />
              
              {/* Messages Area */}
              <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
                {!selectedRoom ? (
                  <Box sx={{ textAlign: 'center', mt: 4 }}>
                    <MessageOutlined style={{ fontSize: '48px', color: '#ccc' }} />
                    <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
                      Select a support room to start chatting
                    </Typography>
                  </Box>
                ) : chatLoading ? (
                  <Box sx={{ textAlign: 'center', mt: 4 }}>
                    <CircularProgress />
                  </Box>
                ) : chatMessages.length === 0 ? (
                  <Box sx={{ textAlign: 'center', mt: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      No messages in this room
                    </Typography>
                  </Box>
                ) : (
                  <Stack spacing={2}>
                    {chatMessages.map((message, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: 'flex',
                          justifyContent: message.isSupport ? 'flex-end' : 'flex-start'
                        }}
                      >
                        <Paper
                          sx={{
                            p: 2,
                            maxWidth: '70%',
                            bgcolor: message.isSupport ? 'primary.main' : 'grey.100',
                            color: message.isSupport ? 'white' : 'text.primary'
                          }}
                        >
                          <Typography variant="body2">
                            {message.message}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              display: 'block',
                              mt: 1,
                              opacity: 0.7
                            }}
                          >
                            {formatTime(message.sentAt)}
                          </Typography>
                        </Paper>
                      </Box>
                    ))}
                  </Stack>
                )}
              </Box>

              {/* Message Input */}
              {selectedRoom && (
                <>
                  <Divider />
                  <Box sx={{ p: 2 }}>
                    <Stack direction="row" spacing={1}>
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="Type your message..."
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        multiline
                        maxRows={3}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={handleSendMessage}
                                disabled={!messageInput.trim() || sendingMessage}
                                color="primary"
                              >
                                <SendOutlined />
                              </IconButton>
                            </InputAdornment>
                          )
                        }}
                      />
                    </Stack>
                  </Box>
                </>
              )}
            </Card>
          </Grid>
        </Grid>
      </Box>

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