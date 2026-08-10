import { useMemo, useState } from 'react'
import { Button, Card, Col, Input, Row, Space, Typography } from 'antd'
import { BayPlanGrid } from '@/components/bay/BayPlanGrid'
import { AdminPageCard } from '@/components/common/AdminPageCard'
import { SignalIndicator } from '@/components/bay/SignalIndicator'
import { PageState } from '@/components/common/PageState'
import { usePolling } from '@/hooks/usePolling'
import { useServerClock } from '@/hooks/useServerClock'
import { useTerminalStore } from '@/stores/terminal'

const DEFAULT_QC = 'QC01'

const TerminalPage = () => {
  const [qcInput, setQcInput] = useState(DEFAULT_QC)
  const [activeQc, setActiveQc] = useState(DEFAULT_QC)
  const data = useTerminalStore((state) => state.data)
  const loading = useTerminalStore((state) => state.loading)
  const error = useTerminalStore((state) => state.error)
  const signalStatus = useTerminalStore((state) => state.signalStatus)
  const fetchTerminalData = useTerminalStore((state) => state.fetchTerminalData)
  const polling = usePolling(activeQc)
  const clock = useServerClock(data?.serverDateTime)
  const normalizedQc = useMemo(() => qcInput.trim().toUpperCase(), [qcInput])

  const handleApplyQc = () => {
    if (!normalizedQc) {
      return
    }
    setActiveQc(normalizedQc)
  }

  const handleRefresh = async () => {
    if (!activeQc) {
      return
    }
    await fetchTerminalData(activeQc)
  }

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="middle">
      <AdminPageCard
        title="Terminal Control"
        subtitle="Select active crane lane and synchronize bay operation data in real time."
      >
        <div className="terminal-toolbar">
          <Input
            value={qcInput}
            onChange={(event) => setQcInput(event.target.value)}
            onPressEnter={handleApplyQc}
            placeholder="Input QC number, e.g. QC01"
            aria-label="QC number"
          />
          <Button type="primary" onClick={handleApplyQc}>
            Apply
          </Button>
          <Button onClick={() => void handleRefresh()} loading={loading}>
            Refresh Now
          </Button>
          <Typography.Text type="secondary">Active: {activeQc}</Typography.Text>
        </div>
      </AdminPageCard>

      <Row gutter={[16, 16]} className="terminal-metrics">
        <Col xs={24} lg={6}>
          <Card>
            <Typography.Text strong>Signal</Typography.Text>
            <div style={{ marginTop: 8 }}>
              <SignalIndicator status={signalStatus} />
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={6}>
          <Card>
            <Typography.Text strong>Server Time</Typography.Text>
            <div style={{ marginTop: 8 }}>{clock.dateTime}</div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card>
            <Typography.Text strong>Polling Interval</Typography.Text>
            <div style={{ marginTop: 8 }}>
              {polling.intervalMs / 1000}s {polling.running ? '(running)' : '(stopped)'}
            </div>
          </Card>
        </Col>
      </Row>

      <PageState loading={loading} error={error} isEmpty={!data} />

      {data ? (
        <AdminPageCard
          title={`${data.vesselName} - ${data.bayName}`}
          subtitle="Live bay matrix and sequence status for current execution queue."
        >
          <BayPlanGrid data={data} />
        </AdminPageCard>
      ) : null}
    </Space>
  )
}

export default TerminalPage
