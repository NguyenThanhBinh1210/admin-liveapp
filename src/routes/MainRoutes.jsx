import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';
import ProtectedRoute from 'components/ProtectedRoute';

// render- Dashboard
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/default')));

// render - color
const Color = Loadable(lazy(() => import('pages/component-overview/color')));
const Typography = Loadable(lazy(() => import('pages/component-overview/typography')));
const Shadow = Loadable(lazy(() => import('pages/component-overview/shadows')));

// render - sample page
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/sample-page')));

// render - users page
const UsersPage = Loadable(lazy(() => import('pages/users')));

// render - topup requests page
const TopupRequestsPage = Loadable(lazy(() => import('pages/topup-requests')));

// render - withdraw requests page
const WithdrawRequestsPage = Loadable(lazy(() => import('pages/withdraw-requests')));

// render - gifts page
const GiftsPage = Loadable(lazy(() => import('pages/gifts')));

// render - config page
const ConfigPage = Loadable(lazy(() => import('pages/config')));

// render - stats page
const StatsPage = Loadable(lazy(() => import('pages/stats')));

// render - streams page
const StreamsPage = Loadable(lazy(() => import('pages/streams')));

// render - notifications page
const NotificationsPage = Loadable(lazy(() => import('pages/notifications')));

// render - support page
const SupportPage = Loadable(lazy(() => import('pages/support')));

// render - moderation page
const ModerationPage = Loadable(lazy(() => import('pages/moderation')));

// render - transactions page
const TransactionsPage = Loadable(lazy(() => import('pages/transactions')));

// render - tools page
const ToolsPage = Loadable(lazy(() => import('pages/tools')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: (
    <ProtectedRoute>
      <DashboardLayout />
    </ProtectedRoute>
  ),
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    },
    {
      path: 'typography',
      element: <Typography />
    },
    {
      path: 'color',
      element: <Color />
    },
    {
      path: 'shadow',
      element: <Shadow />
    },
    {
      path: 'sample-page',
      element: <SamplePage />
    },
    {
      path: 'users',
      element: <UsersPage />
    },
    {
      path: 'topup-requests',
      element: <TopupRequestsPage />
    },
    {
      path: 'withdraw-requests',
      element: <WithdrawRequestsPage />
    },
    {
      path: 'gifts',
      element: <GiftsPage />
    },
    {
      path: 'config',
      element: <ConfigPage />
    },
    {
      path: 'stats',
      element: <StatsPage />
    },
    {
      path: 'streams',
      element: <StreamsPage />
    },
    {
      path: 'notifications',
      element: <NotificationsPage />
    },
    {
      path: 'support',
      element: <SupportPage />
    },
    {
      path: 'moderation',
      element: <ModerationPage />
    },
    {
      path: 'transactions',
      element: <TransactionsPage />
    },
    {
      path: 'tools',
      element: <ToolsPage />
    }
  ]
};

export default MainRoutes;
