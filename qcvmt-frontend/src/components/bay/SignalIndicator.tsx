import { Badge } from 'antd'
import { useTranslation } from 'react-i18next'
import type { SignalStatus } from '@/types/terminal'

interface SignalIndicatorProps {
  status: SignalStatus
  /** 'pill' (default) reads on light surfaces; 'lamp' is styled for the dark terminal banner. */
  variant?: 'pill' | 'lamp'
}

export const SignalIndicator = ({ status, variant = 'pill' }: SignalIndicatorProps) => {
  const { t } = useTranslation()
  const ok = status === 'green'

  if (variant === 'lamp') {
    // Flat colour square standing in for the original <img src="green.gif"/red.gif">.
    return (
      <span
        className={`terminal-signal-lamp${ok ? ' is-ok' : ' is-down'}`}
        role="img"
        aria-label={ok ? t('terminal.signal.green') : t('terminal.signal.red')}
      />
    )
  }

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
