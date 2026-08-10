import { create } from 'zustand'
import { userApi } from '@/api/user'
import type { User } from '@/types/user'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  roles: string[]
  loading: boolean
  hydrateUser: () => Promise<void>
  logout: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: true,
  roles: ['qcvmt-admin', 'qcvmt-user', 'qcvmt-limited'],
  loading: false,
  hydrateUser: async () => {
    try {
      const response = await userApi.me()
      const role = response.data.role
      set({
        user: response.data,
        roles: role ? [role] : ['qcvmt-admin', 'qcvmt-user', 'qcvmt-limited'],
        isAuthenticated: true,
        loading: false,
      })
    } catch {
      set({
        user: null,
        roles: ['qcvmt-admin', 'qcvmt-user', 'qcvmt-limited'],
        isAuthenticated: true,
        loading: false,
      })
    }
  },
  logout: async () => {
    set({
      user: null,
      roles: ['qcvmt-admin', 'qcvmt-user', 'qcvmt-limited'],
      isAuthenticated: true,
      loading: false,
    })
  },
}))
