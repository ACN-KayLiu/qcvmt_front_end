import { useEffect, useState } from 'react'
import { Card, Col, Row, Space, Statistic, Table } from 'antd'
import { operationLogApi } from '@/api/operationLog'
import { userApi } from '@/api/user'
import { vesselApi } from '@/api/vessel'
import { AdminPageCard } from '@/components/common/AdminPageCard'
import { usePageMessage } from '@/hooks/usePageMessage'
import type { OperationLogItem } from '@/types/user'

const DashboardPage = () => {
  const { contextHolder, notifyError } = usePageMessage()
  const [loading, setLoading] = useState(false)
  const [usersTotal, setUsersTotal] = useState(0)
  const [vesselsTotal, setVesselsTotal] = useState(0)
  const [recentLogs, setRecentLogs] = useState<OperationLogItem[]>([])

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true)
      try {
        const [userRes, vesselRes, logRes] = await Promise.all([
          userApi.list({ page: 0, size: 1 }),
          vesselApi.list({ page: 0, size: 1 }),
          operationLogApi.list({ page: 0, size: 8 }),
        ])

        setUsersTotal(userRes.data.totalElements)
        setVesselsTotal(vesselRes.data.totalElements)
        setRecentLogs(logRes.data.content)
      } catch (error) {
        notifyError(error, 'Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    void loadDashboard()
  }, [notifyError])

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="middle">
      {contextHolder}

      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card loading={loading}>
            <Statistic title="Users" value={usersTotal} />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card loading={loading}>
            <Statistic title="Vessels" value={vesselsTotal} />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card loading={loading}>
            <Statistic title="Recent Operations" value={recentLogs.length} />
          </Card>
        </Col>
      </Row>

      <AdminPageCard
        title="Recent Operation Logs"
        subtitle="Latest control-room changes and admin actions."
        loading={loading}
      >
        <Table<OperationLogItem>
          rowKey="id"
          dataSource={recentLogs}
          pagination={false}
          size="small"
          columns={[
            {
              title: 'Action',
              dataIndex: 'actionType',
              key: 'actionType',
            },
            {
              title: 'Function',
              dataIndex: 'functionName',
              key: 'functionName',
            },
            {
              title: 'Value Change',
              dataIndex: 'valueChange',
              key: 'valueChange',
              ellipsis: true,
            },
            {
              title: 'Time',
              dataIndex: 'time',
              key: 'time',
            },
          ]}
        />
      </AdminPageCard>
    </Space>
  )
}

export default DashboardPage
