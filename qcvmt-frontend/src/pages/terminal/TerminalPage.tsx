import { useEffect, useMemo, useRef } from 'react'
import { Button } from 'antd'
import { BayPlanGrid } from '@/components/bay/BayPlanGrid'
import { TerminalBanner } from '@/components/bay/TerminalBanner'
import { PageState } from '@/components/common/PageState'
import { usePolling } from '@/hooks/usePolling'
import { useServerClock } from '@/hooks/useServerClock'
import { useAuthStore } from '@/stores/auth'
import { useTerminalStore } from '@/stores/terminal'
import { MOCK_TERMINAL_DATA } from '@/utils/mockTerminalData'

const TerminalPage = () => {
  const qcid = useAuthStore((state) => state.qcid)
  const data = useTerminalStore((state) => state.data)
  const loading = useTerminalStore((state) => state.loading)
  const error = useTerminalStore((state) => state.error)
  const signalStatus = useTerminalStore((state) => state.signalStatus)
  const setData = useTerminalStore((state) => state.setData)
  const activeQc = useMemo(() => qcid.trim().toUpperCase(), [qcid])
  const polling = usePolling(activeQc)
  const clock = useServerClock(data?.serverDateTime)
  const prevActiveQcRef = useRef(activeQc)

  useEffect(() => {
    const prevActiveQc = prevActiveQcRef.current
    if (prevActiveQc && !activeQc) {
      useTerminalStore.getState().clearData()
    }
    prevActiveQcRef.current = activeQc
  }, [activeQc])

  useEffect(() => {
    if (!activeQc && !data) {
      setData(MOCK_TERMINAL_DATA)
    }
  }, [activeQc, data, setData])

  return (
    <div className="terminal-view">
      <TerminalBanner data={data} dateTime={clock.dateTime} signalStatus={signalStatus} />

      <div id="tableList">
        <div className="terminal-polling-status" aria-live="polite">
          {activeQc ? `QC ${activeQc} | ${polling.intervalMs / 1000}s${polling.running ? '' : ' (paused)'}` : ''}
        </div>
        <div className="terminal-demo-action">
          <Button size="small" type="dashed" onClick={() => setData(MOCK_TERMINAL_DATA)}>
            Demo
          </Button>
        </div>
        <PageState loading={loading} error={error} isEmpty={!data} />
        {data ? <BayPlanGrid data={data} /> : null}
      </div>
    </div>
  )
}

export default TerminalPage
