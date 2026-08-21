import { ArrowLeftOutlined, LogoutOutlined } from '@ant-design/icons'
import { Button, Tooltip } from 'antd'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth'

export const AppHeader = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const logout = useAuthStore((state) => state.logout)

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
      return
    }
    navigate('/terminal')
  }

  return (
    <header className="app-header">
      <Tooltip title="Back">
        <Button icon={<ArrowLeftOutlined />} onClick={handleBack} aria-label="Back" />
      </Tooltip>
      <div className="app-header-actions">
        <Tooltip title={t('auth.logout')}>
          <Button icon={<LogoutOutlined />} onClick={() => void handleLogout()} aria-label={t('auth.logout')} />
        </Tooltip>
      </div>
    </header>
  )
}
