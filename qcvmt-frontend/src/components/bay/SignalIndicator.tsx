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
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '4px 10px',
        borderRadius: 999,
        background: ok ? 'var(--brand-100)' : 'var(--danger-100)',
        border: '1px solid var(--line-soft)',
      }}
    >
      <Badge status={ok ? 'success' : 'error'} />
      <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
        {ok ? t('terminal.signal.green') : t('terminal.signal.red')}
      </span>
    </span>
  )
}
