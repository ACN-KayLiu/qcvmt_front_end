import { theme, type ThemeConfig } from 'antd'

export const getThemeConfig = (isDark: boolean): ThemeConfig => ({
  algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
  token: {
    colorPrimary: '#0f7a63',
    colorInfo: '#0f7a63',
    colorSuccess: '#1f9a78',
    colorWarning: '#d48b2f',
    colorError: '#c94d59',
    borderRadius: 10,
    fontFamily: "'Segoe UI Variable', 'Noto Sans TC', 'PingFang TC', 'Microsoft JhengHei', sans-serif",
    wireframe: false,
  },
  components: {
    Card: {
      borderRadiusLG: 16,
    },
    Table: {
      headerBorderRadius: 12,
    },
    Button: {
      controlHeight: 36,
      controlHeightLG: 42,
    },
  },
})
