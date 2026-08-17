import { apiClient } from '@/lib/axios'
import type { ApiResponse } from '@/api/types'

export interface LoginRequest {
  username: string
  password: string
  qcid: string
}

export interface AuthMeResponse {
  id: number
  keycloakId?: string
  username: string
  qcid?: string
  localRole?: string
  roles?: string[]
  admin?: boolean
  tokenExpiresAt?: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  tokenType?: string
  expiresIn?: number
  refreshExpiresIn?: number
  scope?: string
  user?: AuthMeResponse
}

export interface AuthPermissionsResponse {
  roles?: string[]
  permissions?: string[]
  admin?: boolean
}

export interface StoredAuthTokens {
  accessToken: string
  refreshToken: string
  tokenType: string
}

const ACCESS_TOKEN_KEY = 'qcvmt_access_token'
const REFRESH_TOKEN_KEY = 'qcvmt_refresh_token'
const TOKEN_TYPE_KEY = 'qcvmt_token_type'
const SELECTED_QC_KEY = 'qcvmt_selected_qc'

export const saveAuthTokens = (payload: LoginResponse): void => {
  localStorage.setItem(ACCESS_TOKEN_KEY, payload.accessToken)
  localStorage.setItem(REFRESH_TOKEN_KEY, payload.refreshToken)
  localStorage.setItem(TOKEN_TYPE_KEY, payload.tokenType || 'Bearer')
}

export const getStoredAuthTokens = (): StoredAuthTokens | null => {
  const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY)
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY)
  const tokenType = localStorage.getItem(TOKEN_TYPE_KEY) || 'Bearer'

  if (!accessToken || !refreshToken) {
    return null
  }

  return { accessToken, refreshToken, tokenType }
}

export const clearAuthTokens = (): void => {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
  localStorage.removeItem(TOKEN_TYPE_KEY)
  localStorage.removeItem(SELECTED_QC_KEY)
}

export const saveSelectedQc = (qcid: string): void => localStorage.setItem(SELECTED_QC_KEY, qcid)

export const getStoredSelectedQc = (): string => localStorage.getItem(SELECTED_QC_KEY) || ''

export const authApi = {
  login: (data: LoginRequest): Promise<ApiResponse<LoginResponse>> => apiClient.post('/auth/login', data),
  me: (): Promise<ApiResponse<AuthMeResponse>> => apiClient.get('/auth/me'),
  permissions: (): Promise<ApiResponse<AuthPermissionsResponse>> => apiClient.get('/auth/permissions'),
}
