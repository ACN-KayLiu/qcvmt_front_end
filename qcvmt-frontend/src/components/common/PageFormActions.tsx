import { Button, Space } from 'antd'

interface PageFormActionsProps {
  submitText: string
  loading?: boolean
  onCancel?: () => void
  cancelText?: string
}

export const PageFormActions = ({
  submitText,
  loading,
  onCancel,
  cancelText = 'Cancel',
}: PageFormActionsProps) => {
  return (
    <Space>
      <Button type="primary" htmlType="submit" loading={loading}>
        {submitText}
      </Button>
      {onCancel ? <Button onClick={onCancel}>{cancelText}</Button> : null}
    </Space>
  )
}
