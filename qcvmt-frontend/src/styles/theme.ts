import { theme, type ThemeConfig } from 'antd'

export const getThemeConfig = (isDark: boolean): ThemeConfig => ({
  algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
  token: {
    colorPrimary: '#0a6a55',
    colorInfo: '#0a6a55',
    borderRadius: 8,
    fontFamily: 'Segoe UI, PingFang SC, Microsoft YaHei, sans-serif',
  },
})
