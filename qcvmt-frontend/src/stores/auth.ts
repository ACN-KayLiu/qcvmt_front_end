import { create } from 'zustand'
import {
  authApi,
  clearAuthTokens,
  getStoredSelectedQc,
  getStoredAuthTokens,
  saveAuthTokens,
  saveSelectedQc,
  type AuthMeResponse,
} from '@/api/auth'
import type { Role, User } from '@/types/user'
import { toQcId } from '@/utils/qc'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  roles: string[]
  loading: boolean
  qcid: string
  login: (username: string, password: string, qcid: string) => Promise<void>
  hydrateUser: () => Promise<void>
  logout: () => Promise<void>
}

const DEFAULT_ROLE: Role = 'qcvmt-user'

const isRole = (value: string): value is Role => {
  return value === 'qcvmt-admin' || value === 'qcvmt-user' || value === 'qcvmt-limited'
}

const toRole = (localRole?: string, roles?: string[]): Role => {
  if (localRole && isRole(localRole)) {
    return localRole
  }
  const matched = roles?.find(isRole)
  return matched || DEFAULT_ROLE
}

const toUser = (me: AuthMeResponse): User => {
  const username = me.username || ''
  return {
    id: me.id,
    username,
    qcid: me.qcid || '',
    name: username,
    role: toRole(me.localRole, me.roles),
  }
}

const collectRoles = (me: AuthMeResponse): string[] => {
  const roleSet = new Set<string>()
  if (me.localRole) {
    roleSet.add(me.localRole)
  }
  for (const role of me.roles || []) {
    roleSet.add(role)
  }
  return Array.from(roleSet)
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  roles: [],
  qcid: '',
  loading: true,
  login: async (username, password, qcid) => {
    set({ loading: true })
    try {
      const selectedQc = toQcId(qcid)
      const response = await authApi.login({ username, password, qcid: selectedQc })
      saveAuthTokens(response.data)
      saveSelectedQc(selectedQc)

      if (response.data.user) {
        set({
          user: toUser(response.data.user),
          roles: collectRoles(response.data.user),
          qcid: selectedQc,
          isAuthenticated: true,
          loading: false,
        })
        return
      }

      await get().hydrateUser()
    } catch (error) {
      clearAuthTokens()
      set({
        user: null,
        roles: [],
        qcid: '',
        isAuthenticated: false,
        loading: false,
      })
      throw error
    }
  },
  hydrateUser: async () => {
    const tokens = getStoredAuthTokens()
    if (!tokens) {
      set({
        user: null,
        roles: [],
        qcid: '',
        isAuthenticated: false,
        loading: false,
      })
      return
    }

    set({ loading: true })
    try {
      const response = await authApi.me()
      const selectedQc = getStoredSelectedQc() || toQcId(response.data.qcid || '')
      if (selectedQc) {
        saveSelectedQc(selectedQc)
      }
      set({
        user: toUser(response.data),
        roles: collectRoles(response.data),
        qcid: selectedQc,
        isAuthenticated: true,
        loading: false,
      })
    } catch {
      clearAuthTokens()
      set({
        user: null,
        roles: [],
        qcid: '',
        isAuthenticated: false,
        loading: false,
      })
    }
  },
  logout: async () => {
    clearAuthTokens()
    set({
      user: null,
      roles: [],
      qcid: '',
      isAuthenticated: false,
      loading: false,
    })
  },
}))
