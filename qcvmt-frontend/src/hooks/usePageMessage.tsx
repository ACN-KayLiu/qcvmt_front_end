import { useCallback } from 'react'
import { message } from 'antd'

export const usePageMessage = () => {
  const [messageApi, contextHolder] = message.useMessage()

  const notifySuccess = useCallback((content: string) => {
    messageApi.success(content)
  }, [messageApi])

  const notifyError = useCallback((error: unknown, fallback: string) => {
    messageApi.error((error as Error)?.message || fallback)
  }, [messageApi])

  const notifyWarning = useCallback((content: string) => {
    messageApi.warning(content)
  }, [messageApi])

  return {
    contextHolder,
    notifySuccess,
    notifyError,
    notifyWarning,
  }
}
