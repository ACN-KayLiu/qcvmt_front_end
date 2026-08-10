import { Layout, Menu } from 'antd'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { AppHeader } from '@/components/layout/AppHeader'

const items = [
  { key: '/admin', label: <Link to="/admin">Dashboard</Link> },
  { key: '/admin/users', label: <Link to="/admin/users">Users</Link> },
  { key: '/admin/vessels', label: <Link to="/admin/vessels">Vessels</Link> },
  { key: '/admin/color-sets', label: <Link to="/admin/color-sets">Color Sets</Link> },
  { key: '/admin/vessel-colors', label: <Link to="/admin/vessel-colors">Vessel Colors</Link> },
  { key: '/admin/vessel-refuels', label: <Link to="/admin/vessel-refuels">Vessel Refuels</Link> },
  { key: '/admin/bay-config', label: <Link to="/admin/bay-config">Bay Config</Link> },
  { key: '/admin/import', label: <Link to="/admin/import">Import</Link> },
  { key: '/admin/export', label: <Link to="/admin/export">Export</Link> },
]

const AdminLayout = () => {
  const location = useLocation()

  return (
    <Layout className="page-shell">
      <AppHeader />
      <Layout className="surface-card" style={{ minHeight: 'calc(100vh - 96px)' }}>
        <Layout.Sider breakpoint="lg" collapsedWidth="0" width={230} theme="light">
          <Menu mode="inline" selectedKeys={[location.pathname]} items={items} />
        </Layout.Sider>
        <Layout.Content style={{ padding: 16 }}>
          <Outlet />
        </Layout.Content>
      </Layout>
    </Layout>
  )
}

export default AdminLayout
