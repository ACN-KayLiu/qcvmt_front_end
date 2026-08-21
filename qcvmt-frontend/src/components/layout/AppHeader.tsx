import { DownOutlined, GlobalOutlined, LogoutOutlined, MoonOutlined, SettingOutlined, SunOutlined } from '@ant-design/icons'
import { Button, Dropdown, Typography } from 'antd'
import type { MenuProps } from 'antd'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '@/stores/app'
import { useAuthStore } from '@/stores/auth'
import { usePermission } from '@/hooks/usePermission'

const LANG_LABELS: Record<string, string> = {
  en: 'English',
  'zh-CN': '简体中文',
  'zh-TW': '繁體中文',
}

const LANG_SHORT: Record<string, string> = {
  en: 'EN',
  'zh-CN': '简',
  'zh-TW': '繁',
}

export const AppHeader = () => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const toggleTheme = useAppStore((state) => state.toggleTheme)
  const themeMode = useAppStore((state) => state.themeMode)
  const logout = useAuthStore((state) => state.logout)
  const { isAdmin } = usePermission()

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="app-header">
      <Typography.Title level={4} className="app-header-title">
        {t('app.title')}
      </Typography.Title>
      <div className="app-header-actions">
        <Dropdown
          menu={{
            selectedKeys: [i18n.language],
            items: Object.entries(LANG_LABELS).map(([key, label]) => ({ key, label })),
            onClick: ({ key }) => void i18n.changeLanguage(key),
          } satisfies MenuProps}
          trigger={['click']}
        >
          <Button icon={<GlobalOutlined />}>
            {LANG_SHORT[i18n.language] ?? i18n.language}
            <DownOutlined style={{ fontSize: 10, opacity: 0.5, marginLeft: 2 }} />
          </Button>
        </Dropdown>
        <Button
          icon={themeMode === 'dark' ? <SunOutlined /> : <MoonOutlined />}
          onClick={toggleTheme}
          aria-label="Toggle theme"
        />
        {isAdmin && (
          <Button icon={<SettingOutlined />} onClick={() => navigate('/admin')}>
            {t('admin.settings')}
          </Button>
        )}
        <Button icon={<LogoutOutlined />} onClick={() => void handleLogout()}>
          {t('auth.logout')}
        </Button>
      </div>
    </header>
  )
}
