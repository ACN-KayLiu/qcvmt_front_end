import { message } from 'antd'

export const usePageMessage = () => {
  const [messageApi, contextHolder] = message.useMessage()

  const notifySuccess = (content: string) => {
    messageApi.success(content)
  }

  const notifyError = (error: unknown, fallback: string) => {
    messageApi.error((error as Error)?.message || fallback)
  }

  const notifyWarning = (content: string) => {
    messageApi.warning(content)
  }

  return {
    contextHolder,
    notifySuccess,
    notifyError,
    notifyWarning,
  }
}
