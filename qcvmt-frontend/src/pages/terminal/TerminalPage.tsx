import { useEffect, useMemo } from 'react'
import { BayPlanGrid } from '@/components/bay/BayPlanGrid'
import { TerminalBanner } from '@/components/bay/TerminalBanner'
import { PageState } from '@/components/common/PageState'
import { usePolling } from '@/hooks/usePolling'
import { useServerClock } from '@/hooks/useServerClock'
import { useAuthStore } from '@/stores/auth'
import { useTerminalStore } from '@/stores/terminal'
import { MOCK_TERMINAL_DATA } from '@/utils/mockTerminalData'
import { toQcId } from '@/utils/qc'

const TerminalPage = () => {
  const qcid = useAuthStore((state) => state.qcid)
  const data = useTerminalStore((state) => state.data)
  const loading = useTerminalStore((state) => state.loading)
  const error = useTerminalStore((state) => state.error)
  const signalStatus = useTerminalStore((state) => state.signalStatus)
  const setData = useTerminalStore((state) => state.setData)
  const activeQc = useMemo(() => toQcId(qcid), [qcid])
  usePolling(activeQc)
  const clock = useServerClock(data?.serverDateTime)
  const isInitialLoading = loading && !data
  const blockingError = data ? null : error

  useEffect(() => {
    if (!activeQc && !data) {
      setData(MOCK_TERMINAL_DATA)
    }
  }, [activeQc, data, setData])

  return (
    <div className="terminal-view">
      <TerminalBanner data={data} dateTime={clock.dateTime} signalStatus={signalStatus} />

      <div id="tableList">
        <PageState loading={isInitialLoading} error={blockingError} isEmpty={!data && !isInitialLoading} />
        {data ? <BayPlanGrid data={data} /> : null}
      </div>
    </div>
  )
}

export default TerminalPage
