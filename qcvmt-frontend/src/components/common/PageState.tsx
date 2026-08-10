import { Alert, Button, Empty, Skeleton, Space } from 'antd'
import { useTranslation } from 'react-i18next'

interface PageStateProps {
  loading?: boolean
  error?: string | null
  isEmpty?: boolean
  onRetry?: () => void
}

export const PageState = ({ loading, error, isEmpty, onRetry }: PageStateProps) => {
  const { t } = useTranslation()

  if (loading) {
    return (
      <Space direction="vertical" style={{ width: '100%' }}>
        <Skeleton active />
        <Skeleton active />
      </Space>
    )
  }

  if (error) {
    return (
      <Alert
        type="error"
        message={t('state.error')}
        description={error}
        action={onRetry ? <Button onClick={onRetry}>Retry</Button> : undefined}
      />
    )
  }

  if (isEmpty) {
    return <Empty description={t('state.empty')} />
  }

  return null
}
