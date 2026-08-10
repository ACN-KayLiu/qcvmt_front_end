import { Layout } from 'antd'
import { Outlet } from 'react-router-dom'
import { AppHeader } from '@/components/layout/AppHeader'

const TerminalLayout = () => {
  return (
    <Layout className="page-shell">
      <AppHeader />
      <Layout.Content className="surface-card" style={{ padding: 16 }}>
        <Outlet />
      </Layout.Content>
    </Layout>
  )
}

export default TerminalLayout
