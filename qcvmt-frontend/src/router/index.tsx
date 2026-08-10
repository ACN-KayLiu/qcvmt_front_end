import { Suspense, lazy, type ComponentType } from 'react'
import { Spin } from 'antd'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AuthGuard } from '@/components/common/AuthGuard'

const AdminLayout = lazy(() => import('@/components/layout/AdminLayout'))
const TerminalLayout = lazy(() => import('@/components/layout/TerminalLayout'))
const TerminalPage = lazy(() => import('@/pages/terminal/TerminalPage'))
const DashboardPage = lazy(() => import('@/pages/admin/DashboardPage'))
const UserList = lazy(() => import('@/pages/admin/UserList'))
const UserForm = lazy(() => import('@/pages/admin/UserForm'))
const UserLogs = lazy(() => import('@/pages/admin/UserLogs'))
const VesselList = lazy(() => import('@/pages/admin/VesselList'))
const VesselForm = lazy(() => import('@/pages/admin/VesselForm'))
const ColorSetList = lazy(() => import('@/pages/admin/ColorSetList'))
const ColorSetForm = lazy(() => import('@/pages/admin/ColorSetForm'))
const VesselColorList = lazy(() => import('@/pages/admin/VesselColorList'))
const VesselColorForm = lazy(() => import('@/pages/admin/VesselColorForm'))
const VesselRefuelList = lazy(() => import('@/pages/admin/VesselRefuelList'))
const VesselRefuelForm = lazy(() => import('@/pages/admin/VesselRefuelForm'))
const BaySizeForm = lazy(() => import('@/pages/admin/BaySizeForm'))
const ImportPage = lazy(() => import('@/pages/admin/ImportPage'))
const ExportPage = lazy(() => import('@/pages/admin/ExportPage'))

const withSuspense = (Component: ComponentType): JSX.Element => (
  <Suspense fallback={<Spin fullscreen />}>
    <Component />
  </Suspense>
)

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Navigate to="/terminal" replace />,
  },
  {
    path: '/',
    element: <AuthGuard />,
    children: [
      {
        path: 'terminal',
        element: withSuspense(TerminalLayout),
        children: [{ index: true, element: withSuspense(TerminalPage) }],
      },
      {
        path: 'admin',
        element: withSuspense(AdminLayout),
        children: [
          { index: true, element: withSuspense(DashboardPage) },
          { path: 'users', element: withSuspense(UserList) },
          { path: 'users/new', element: withSuspense(UserForm) },
          { path: 'users/:id', element: withSuspense(UserForm) },
          { path: 'users/:id/logs', element: withSuspense(UserLogs) },
          { path: 'vessels', element: withSuspense(VesselList) },
          { path: 'vessels/new', element: withSuspense(VesselForm) },
          { path: 'vessels/:id', element: withSuspense(VesselForm) },
          { path: 'color-sets', element: withSuspense(ColorSetList) },
          { path: 'color-sets/new', element: withSuspense(ColorSetForm) },
          { path: 'color-sets/:id', element: withSuspense(ColorSetForm) },
          { path: 'vessel-colors', element: withSuspense(VesselColorList) },
          { path: 'vessel-colors/new', element: withSuspense(VesselColorForm) },
          { path: 'vessel-colors/:id', element: withSuspense(VesselColorForm) },
          { path: 'vessel-refuels', element: withSuspense(VesselRefuelList) },
          { path: 'vessel-refuels/new', element: withSuspense(VesselRefuelForm) },
          { path: 'vessel-refuels/:id', element: withSuspense(VesselRefuelForm) },
          { path: 'bay-config', element: withSuspense(BaySizeForm) },
          { path: 'import', element: withSuspense(ImportPage) },
          { path: 'export', element: withSuspense(ExportPage) },
        ],
      },
      {
        index: true,
        element: <Navigate to="/terminal" replace />,
      },
    ],
  },
])
