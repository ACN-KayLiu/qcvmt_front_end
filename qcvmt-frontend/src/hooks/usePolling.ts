import { useCallback, useEffect, useRef } from 'react'
import { useTerminalStore } from '@/stores/terminal'

const BASE_INTERVAL = 15_000
const MAX_INTERVAL = 30_000
const STEP_INTERVAL = 5_000

export const usePolling = (qcNum: string) => {
  const fetchTerminalData = useTerminalStore((state) => state.fetchTerminalData)
  const setPolling = useTerminalStore((state) => state.setPolling)
  const polling = useTerminalStore((state) => state.polling)

  const timerRef = useRef<number | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const scheduleNext = useCallback(
    (timeoutCount: number) => {
      const nextInterval = Math.min(BASE_INTERVAL + timeoutCount * STEP_INTERVAL, MAX_INTERVAL)
      setPolling({ intervalMs: nextInterval, timeoutCount })

      timerRef.current = window.setTimeout(async () => {
        abortRef.current = new AbortController()
        try {
          await fetchTerminalData(qcNum, abortRef.current.signal)
          scheduleNext(0)
        } catch {
          scheduleNext(Math.min(timeoutCount + 1, 3))
        }
      }, nextInterval)
    },
    [fetchTerminalData, qcNum, setPolling],
  )

  useEffect(() => {
    if (!qcNum) {
      return
    }

    const startPolling = async () => {
      setPolling({ running: true, intervalMs: BASE_INTERVAL, timeoutCount: 0 })
      abortRef.current = new AbortController()
      try {
        await fetchTerminalData(qcNum, abortRef.current.signal)
        scheduleNext(0)
      } catch {
        scheduleNext(1)
      }
    }

    void startPolling()

    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current)
      }
      if (abortRef.current) {
        abortRef.current.abort()
      }
      setPolling({ running: false })
    }
  }, [fetchTerminalData, qcNum, scheduleNext, setPolling])

  return polling
}
