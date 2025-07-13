// assets
import { UserOutlined, TeamOutlined, SettingOutlined, WalletOutlined, SendOutlined, GiftOutlined, BarChartOutlined } from '@ant-design/icons';

// icons
const icons = {
  UserOutlined,
  TeamOutlined,
  SettingOutlined,
  WalletOutlined,
  SendOutlined,
  GiftOutlined,
  BarChartOutlined
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
    }
  ]
};

export default admin; 