import type { PropsWithChildren, ReactNode } from 'react'
import { Card, Space, Typography } from 'antd'

interface AdminPageCardProps extends PropsWithChildren {
  title: string
  subtitle?: string
  extra?: ReactNode
  loading?: boolean
}

export const AdminPageCard = ({ title, subtitle, extra, loading, children }: AdminPageCardProps) => {
  return (
    <Card loading={loading} className="admin-page-card">
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <div className="admin-page-header">
          <div className="admin-page-header-text">
            <Typography.Title level={5} className="admin-page-title">
              {title}
            </Typography.Title>
            {subtitle ? (
              <Typography.Paragraph type="secondary" className="admin-page-subtitle">
                {subtitle}
              </Typography.Paragraph>
            ) : null}
          </div>
          {extra ? <div className="admin-page-header-actions">{extra}</div> : null}
        </div>
        {children}
      </Space>
    </Card>
  )
}
