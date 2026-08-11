import { Layout } from 'antd'
import { Outlet } from 'react-router-dom'
import { AppHeader } from '@/components/layout/AppHeader'

/** Bypass AppShellLayout — no surface-card, no maxWidth, no 20px padding box. */
const TerminalLayout = () => (
  <Layout className="app-shell" style={{ minHeight: '100vh', padding: 12 }}>
    <AppHeader />
    <Layout.Content>
      <div className="route-page">
        <Outlet />
      </div>
    </Layout.Content>
  </Layout>
)

export default TerminalLayout
