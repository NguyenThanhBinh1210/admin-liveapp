// assets
import { 
  UserOutlined, 
  TeamOutlined, 
  SettingOutlined, 
  WalletOutlined, 
  SendOutlined, 
  GiftOutlined, 
  BarChartOutlined,
  VideoCameraOutlined,
  NotificationOutlined,
  MessageOutlined,
  SafetyOutlined,
  ToolOutlined,
  FileTextOutlined
} from '@ant-design/icons';

// icons
const icons = {
  UserOutlined,
  TeamOutlined,
  SettingOutlined,
  WalletOutlined,
  SendOutlined,
  GiftOutlined,
  BarChartOutlined,
  VideoCameraOutlined,
  NotificationOutlined,
  MessageOutlined,
  SafetyOutlined,
  ToolOutlined,
  FileTextOutlined
};

// ==============================|| MENU ITEMS - ADMIN ||============================== //

const admin = {
  id: 'admin',
  title: 'Administration',
  type: 'group',
  children: [
    {
      id: 'users',
      title: 'Users Management',
      type: 'item',
      url: '/users',
      icon: icons.TeamOutlined,
      breadcrumbs: false
    },
    {
      id: 'topup-requests',
      title: 'Top-up Requests',
      type: 'item',
      url: '/topup-requests',
      icon: icons.WalletOutlined,
      breadcrumbs: false
    },
    {
      id: 'withdraw-requests',
      title: 'Withdraw Requests',
      type: 'item',
      url: '/withdraw-requests',
      icon: icons.SendOutlined,
      breadcrumbs: false
    },
    {
      id: 'gifts',
      title: 'Gifts Management',
      type: 'item',
      url: '/gifts',
      icon: icons.GiftOutlined,
      breadcrumbs: false
    },
    {
      id: 'config',
      title: 'System Config',
      type: 'item',
      url: '/config',
      icon: icons.SettingOutlined,
      breadcrumbs: false
    },
    {
      id: 'stats',
      title: 'Platform Statistics',
      type: 'item',
      url: '/stats',
      icon: icons.BarChartOutlined,
      breadcrumbs: false
    },
    {
      id: 'streams',
      title: 'Livestream Management',
      type: 'item',
      url: '/streams',
      icon: icons.VideoCameraOutlined,
      breadcrumbs: false
    },
    {
      id: 'notifications',
      title: 'Notifications',
      type: 'item',
      url: '/notifications',
      icon: icons.NotificationOutlined,
      breadcrumbs: false
    },
    {
      id: 'support',
      title: 'Support Chat',
      type: 'item',
      url: '/support',
      icon: icons.MessageOutlined,
      breadcrumbs: false
    },
    {
      id: 'moderation',
      title: 'Moderation & Reports',
      type: 'item',
      url: '/moderation',
      icon: icons.SafetyOutlined,
      breadcrumbs: false
    },
    {
      id: 'transactions',
      title: 'All Transactions',
      type: 'item',
      url: '/transactions',
      icon: icons.FileTextOutlined,
      breadcrumbs: false
    },
    {
      id: 'tools',
      title: 'Admin Tools',
      type: 'item',
      url: '/tools',
      icon: icons.ToolOutlined,
      breadcrumbs: false
    }
  ]
};

export default admin; 