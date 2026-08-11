import { useMemo, useState } from 'react'
import { Button, Input } from 'antd'
import { BayPlanGrid } from '@/components/bay/BayPlanGrid'
import { AdminPageCard } from '@/components/common/AdminPageCard'
import { SignalIndicator } from '@/components/bay/SignalIndicator'
import { PageState } from '@/components/common/PageState'
import { usePolling } from '@/hooks/usePolling'
import { useServerClock } from '@/hooks/useServerClock'
import { useTerminalStore } from '@/stores/terminal'
import { MOCK_TERMINAL_DATA } from '@/utils/mockTerminalData'

const DEFAULT_QC = 'QC01'

const TerminalPage = () => {
  const [qcInput, setQcInput] = useState(DEFAULT_QC)
  const [activeQc, setActiveQc] = useState(DEFAULT_QC)
  const data = useTerminalStore((state) => state.data)
  const loading = useTerminalStore((state) => state.loading)
  const error = useTerminalStore((state) => state.error)
  const signalStatus = useTerminalStore((state) => state.signalStatus)
  const fetchTerminalData = useTerminalStore((state) => state.fetchTerminalData)
  const setData = useTerminalStore((state) => state.setData)
  const polling = usePolling(activeQc)
  const clock = useServerClock(data?.serverDateTime)
  const normalizedQc = useMemo(() => qcInput.trim().toUpperCase(), [qcInput])

  const handleApplyQc = () => {
    if (!normalizedQc) return
    setActiveQc(normalizedQc)
  }

  const handleRefresh = async () => {
    if (!activeQc) return
    await fetchTerminalData(activeQc)
  }

  const cardTitle = data ? `${data.vesselName} — Bay ${data.bayName}` : 'Terminal'

  const cardExtra = data ? (
    <div className="terminal-context">
      {data.voyage ? <span className="bay-chip">{data.voyage}</span> : null}
      <span className="bay-chip">QC {data.qcAct}</span>
    </div>
  ) : null

  return (
    <AdminPageCard title={cardTitle} extra={cardExtra}>
      <div className="terminal-controls">
        <div className="terminal-controls-status">
          {data ? (
            <>
              <span className="tsr-sep" aria-hidden="true" />
            </>
          ) : null}
          <SignalIndicator status={signalStatus} />
          {data ? (
            <>
              <span className="tsr-sep" aria-hidden="true" />
              <span className="tsr-item">
                <span className="tsr-label">Clock</span>
                {clock.dateTime}
              </span>
              <span className="tsr-sep" aria-hidden="true" />
              <span className="tsr-item">
                <span className="tsr-label">Poll</span>
                {polling.intervalMs / 1000}s{polling.running ? '' : ' (paused)'}
              </span>
            </>
          ) : null}
        </div>
        <div className="terminal-controls-actions">
          <Input
            value={qcInput}
            onChange={(event) => setQcInput(event.target.value)}
            onPressEnter={handleApplyQc}
            placeholder="QC number"
            aria-label="QC number"
          />
          <Button type="primary" onClick={handleApplyQc}>
            Apply
          </Button>
          <Button onClick={() => void handleRefresh()} loading={loading}>
            Refresh
          </Button>
          <Button type="dashed" onClick={() => setData(MOCK_TERMINAL_DATA)}>
            Demo
          </Button>
        </div>
      </div>

      <PageState loading={loading} error={error} isEmpty={!data} />
      {data ? <BayPlanGrid data={data} /> : null}
    </AdminPageCard>
  )
}

export default TerminalPage

