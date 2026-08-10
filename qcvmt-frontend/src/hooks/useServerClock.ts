import { useEffect, useMemo, useState } from 'react'
import dayjs from 'dayjs'

export const useServerClock = (serverDateTime?: string) => {
  const [now, setNow] = useState(() => (serverDateTime ? dayjs(serverDateTime) : dayjs()))

  useEffect(() => {
    if (serverDateTime) {
      setNow(dayjs(serverDateTime))
    }
  }, [serverDateTime])

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow((prev) => prev.add(1, 'second'))
    }, 1000)

    return () => {
      window.clearInterval(timer)
    }
  }, [])

  return useMemo(
    () => ({
      date: now.format('YYYY-MM-DD'),
      time: now.format('HH:mm:ss'),
      dateTime: now.format('YYYY-MM-DD HH:mm:ss'),
    }),
    [now],
  )
}
