import { create } from 'zustand'

type ThemeMode = 'light' | 'dark'

interface AppState {
  locale: string
  themeMode: ThemeMode
  sidebarCollapsed: boolean
  setLocale: (locale: string) => void
  toggleTheme: () => void
  toggleSidebar: () => void
}

export const useAppStore = create<AppState>((set) => ({
  locale: import.meta.env.VITE_APP_DEFAULT_LOCALE || 'en',
  themeMode: 'light',
  sidebarCollapsed: false,
  setLocale: (locale) => set({ locale }),
  toggleTheme: () =>
    set((state) => ({
      themeMode: state.themeMode === 'light' ? 'dark' : 'light',
    })),
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
}))
