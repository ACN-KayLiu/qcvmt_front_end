import { beforeEach, describe, expect, it, vi } from 'vitest'
import { authApi } from '@/api/auth'
import { useAuthStore } from '@/stores/auth'

vi.mock('@/api/auth', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/api/auth')>()
  return {
    ...actual,
    authApi: {
      ...actual.authApi,
      login: vi.fn(),
      me: vi.fn(),
    },
  }
})

const masterUser = {
  id: 1,
  username: 'operator',
  qcid: 'QC58',
  localRole: 'qcvmt-user',
  roles: ['qcvmt-user'],
}

describe('selected login QC', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
      roles: [],
      loading: false,
      qcid: '',
    })
    vi.clearAllMocks()
  })

  it('normalizes backend admin roles for frontend permissions', async () => {
    vi.mocked(authApi.login).mockResolvedValue({
      code: 200,
      message: 'OK',
      timestamp: Date.now(),
      data: {
        accessToken: 'access',
        refreshToken: 'refresh',
        user: {
          id: 2,
          username: 'admin',
          qcid: 'QC16',
          localRole: 'ADMIN',
          roles: ['ROLE_qcvmt-admin'],
          admin: true,
        },
      },
    })

    await useAuthStore.getState().login('admin', 'password', '16')

    expect(useAuthStore.getState().roles).toContain('qcvmt-admin')
    expect(useAuthStore.getState().user?.role).toBe('qcvmt-admin')
  })

  it('keeps QC16 across hydration even when the user master is QC58', async () => {
    vi.mocked(authApi.login).mockResolvedValue({
      code: 200,
      message: 'OK',
      timestamp: Date.now(),
      data: {
        accessToken: 'access',
        refreshToken: 'refresh',
        user: masterUser,
      },
    })
    vi.mocked(authApi.me).mockResolvedValue({
      code: 200,
      message: 'OK',
      timestamp: Date.now(),
      data: masterUser,
    })

    await useAuthStore.getState().login('operator', 'password', '16')
    expect(useAuthStore.getState().qcid).toBe('QC16')

    useAuthStore.setState({ qcid: '' })
    await useAuthStore.getState().hydrateUser()

    expect(useAuthStore.getState().qcid).toBe('QC16')
    expect(authApi.login).toHaveBeenCalledWith({
      username: 'operator',
      password: 'password',
      qcid: 'QC16',
    })
  })
})