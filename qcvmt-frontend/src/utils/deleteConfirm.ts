import { Modal } from 'antd'

interface DeleteConfirmOptions {
  title: string
  successMessage: string
  fallbackErrorMessage?: string
  onDelete: () => Promise<void>
  onAfterDelete?: () => Promise<void> | void
  notifySuccess: (content: string) => void
  notifyError: (error: unknown, fallback: string) => void
}

export const showDeleteConfirm = ({
  title,
  successMessage,
  fallbackErrorMessage = 'Delete failed',
  onDelete,
  onAfterDelete,
  notifySuccess,
  notifyError,
}: DeleteConfirmOptions) => {
  Modal.confirm({
    title,
    content: 'This action cannot be undone.',
    okText: 'Delete',
    okButtonProps: { danger: true },
    onOk: async () => {
      try {
        await onDelete()
        notifySuccess(successMessage)
        if (onAfterDelete) {
          await onAfterDelete()
        }
      } catch (error) {
        notifyError(error, fallbackErrorMessage)
      }
    },
  })
}
