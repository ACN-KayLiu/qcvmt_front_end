import { Layout, Menu } from 'antd'
import type { MenuProps } from 'antd'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { AppShellLayout } from '@/components/layout/AppShellLayout'

type MenuItem = Required<MenuProps>['items'][number]

const navItems: MenuItem[] = [
  { key: '/admin', label: <Link to="/admin">Dashboard</Link> },
  {
    type: 'group',
    label: 'Data',
    children: [
      { key: '/admin/users', label: <Link to="/admin/users">Users</Link> },
      { key: '/admin/vessels', label: <Link to="/admin/vessels">Vessels</Link> },
      { key: '/admin/color-sets', label: <Link to="/admin/color-sets">Color Sets</Link> },
      { key: '/admin/vessel-colors', label: <Link to="/admin/vessel-colors">Vessel Colors</Link> },
      { key: '/admin/vessel-refuels', label: <Link to="/admin/vessel-refuels">Vessel Refuels</Link> },
      { key: '/admin/bay-config', label: <Link to="/admin/bay-config">Bay Config</Link> },
    ],
  },
  {
    type: 'group',
    label: 'I/O',
    children: [
      { key: '/admin/import', label: <Link to="/admin/import">Import</Link> },
      { key: '/admin/export', label: <Link to="/admin/export">Export</Link> },
    ],
  },
]

const subKeys = [
  '/admin/users', '/admin/vessels', '/admin/color-sets',
  '/admin/vessel-colors', '/admin/vessel-refuels', '/admin/bay-config',
  '/admin/import', '/admin/export',
]

const resolveMenuKey = (pathname: string): string => {
  if (pathname === '/admin') return '/admin'
  return subKeys.find((key) => pathname === key || pathname.startsWith(`${key}/`)) || '/admin'
}

const AdminLayout = () => {
  const location = useLocation()

  return (
    <AppShellLayout
      sider={
        <Layout.Sider breakpoint="lg" collapsedWidth="0" width={230} theme="light" className="admin-sider">
          <Menu mode="inline" selectedKeys={[resolveMenuKey(location.pathname)]} items={navItems} />
        </Layout.Sider>
      }
    >
      <Outlet />
    </AppShellLayout>
  )
}

export default AdminLayout
