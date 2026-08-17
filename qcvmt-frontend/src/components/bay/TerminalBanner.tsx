import { LogoutOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { SignalIndicator } from '@/components/bay/SignalIndicator'
import { useAuthStore } from '@/stores/auth'
import { useTerminalStore } from '@/stores/terminal'
import type { SignalStatus, TerminalView } from '@/types/terminal'

interface TerminalBannerProps {
  data: TerminalView | null
  dateTime: string
  signalStatus: SignalStatus
}

const remainingCount = (data: TerminalView | null): number => {
  return data?.remainingContainers ?? 0
}

/**
 * Literal replica of the legacy tqcvmt.jsp `#headerInfo` table: a flat blue
 * table, two rows, Times New Roman, white text — no gradients, shadows,
 * radius, or motion. Row 1: date/time, signal, title, facility. Row 2:
 * QC/bay, activity, remaining containers, refuel, vessel.
 */
export const TerminalBanner = ({ data, dateTime, signalStatus }: TerminalBannerProps) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const logout = useAuthStore((state) => state.logout)
  const clearData = useTerminalStore((state) => state.clearData)
  const refueling = Boolean(data?.reful)

  const handleLogout = async () => {
    clearData()
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <div id="headerInfo">
      <Button
        size="small"
        type="text"
        className="terminal-banner-logout"
        icon={<LogoutOutlined />}
        onClick={() => void handleLogout()}
      >
        {t('auth.logout')}
      </Button>
      <table className="terminal-banner-table">
        <colgroup>
          <col style={{ width: '25%' }} />
          <col style={{ width: '8%' }} />
          <col style={{ width: '24%' }} />
          <col style={{ width: '21%' }} />
          <col style={{ width: '22%' }} />
        </colgroup>
        <tbody>
          <tr>
            <td className="d1_d">{dateTime}</td>
            <td className="d1_d">
              <SignalIndicator status={signalStatus} variant="lamp" />
            </td>
            <td className="d1_d">
              <span>{t('terminal.banner.title')}</span>
            </td>
            <td className="d1_d" style={{ textAlign: 'right' }} colSpan={2}>
              <span>{t('terminal.banner.facility')}</span>
            </td>
          </tr>
          <tr>
            <td className="d1_head" style={{ textAlign: 'left' }}>
              <span>{data ? data.qcAct : ''}</span>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <span>{data ? `${t('terminal.banner.bay')}:${data.bayName}` : ''}</span>
            </td>
            <td className="d1_head" style={{ textAlign: 'center' }}>
              <span>{data ? data.qcAct : ''}</span>
            </td>
            <td className="d1_head" style={{ textAlign: 'center' }}>
              <span>{data ? `${t('terminal.banner.remaining')}:${remainingCount(data)}` : ''}</span>
            </td>
            <td className="d1_head" style={{ textAlign: 'center' }}>
              <span style={refueling ? { color: 'red' } : undefined}>{data?.reful ?? ''}</span>
            </td>
            <td className="d1_head" style={{ textAlign: 'right' }}>
              <span>{data ? data.vesselName : ''}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
