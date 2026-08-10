import { Badge } from 'antd'
import { useTranslation } from 'react-i18next'
import type { SignalStatus } from '@/types/terminal'

interface SignalIndicatorProps {
  status: SignalStatus
}

export const SignalIndicator = ({ status }: SignalIndicatorProps) => {
  const { t } = useTranslation()
  const ok = status === 'green'

  return (
    <Badge
      status={ok ? 'success' : 'error'}
      text={ok ? t('terminal.signal.green') : t('terminal.signal.red')}
    />
  )
}
