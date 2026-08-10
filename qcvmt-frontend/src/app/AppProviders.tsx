import { useEffect, type PropsWithChildren } from 'react'
import { ConfigProvider } from 'antd'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/lib/i18n'
import { useAppStore } from '@/stores/app'
import { getThemeConfig } from '@/styles/theme'

export const AppProviders = ({ children }: PropsWithChildren) => {
  const isDark = useAppStore((state) => state.themeMode === 'dark')

  useEffect(() => {
    document.documentElement.dataset.theme = isDark ? 'dark' : 'light'
  }, [isDark])

  return (
    <I18nextProvider i18n={i18n}>
      <ConfigProvider theme={getThemeConfig(isDark)}>{children}</ConfigProvider>
    </I18nextProvider>
  )
}
