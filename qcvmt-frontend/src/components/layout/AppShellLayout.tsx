import type { PropsWithChildren, ReactNode } from 'react'
import { Layout } from 'antd'
import { AppHeader } from '@/components/layout/AppHeader'

interface AppShellLayoutProps extends PropsWithChildren {
  sider?: ReactNode
}

export const AppShellLayout = ({ sider, children }: AppShellLayoutProps) => {
  return (
    <Layout className="page-shell app-shell">
      <AppHeader />
      <Layout className="surface-card" style={{ minHeight: 'calc(100vh - 96px)' }}>
        {sider}
        <Layout.Content style={{ padding: 20, width: '100%', maxWidth: 1620, margin: '0 auto' }}>
          <div className="route-page">{children}</div>
        </Layout.Content>
      </Layout>
    </Layout>
  )
}
