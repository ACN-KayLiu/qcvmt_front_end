import { useEffect, useState } from 'react'
import { Card, Col, Row, Space, Statistic, Table, Typography, message } from 'antd'
import { operationLogApi } from '@/api/operationLog'
import { userApi } from '@/api/user'
import { vesselApi } from '@/api/vessel'
import type { OperationLogItem } from '@/types/user'

const DashboardPage = () => {
  const [messageApi, contextHolder] = message.useMessage()
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
        messageApi.error((error as Error).message || 'Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    void loadDashboard()
  }, [messageApi])

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

      <Card loading={loading}>
        <Typography.Title level={5} style={{ marginTop: 0 }}>
          Recent Operation Logs
        </Typography.Title>

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
      </Card>
    </Space>
  )
}

export default DashboardPage
