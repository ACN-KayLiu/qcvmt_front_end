import { BulbOutlined, LogoutOutlined } from '@ant-design/icons'
import { Button, Segmented, Space, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '@/stores/app'
import { useAuthStore } from '@/stores/auth'

export const AppHeader = () => {
  const { t, i18n } = useTranslation()
  const toggleTheme = useAppStore((state) => state.toggleTheme)
  const logout = useAuthStore((state) => state.logout)

  return (
    <header className="app-header">
      <Typography.Title level={4} className="app-header-title">
        {t('app.title')}
      </Typography.Title>
      <div className="app-header-actions">
        <Segmented
          size="small"
          options={['en', 'zh-CN', 'zh-TW']}
          value={i18n.language}
          onChange={(value) => {
            void i18n.changeLanguage(String(value))
          }}
          aria-label="Language switcher"
        />
        <Button icon={<BulbOutlined />} onClick={toggleTheme} aria-label="Toggle theme" />
        <Button icon={<LogoutOutlined />} onClick={() => void logout()}>
          {t('auth.logout')}
        </Button>
      </div>
    </header>
  )
}
