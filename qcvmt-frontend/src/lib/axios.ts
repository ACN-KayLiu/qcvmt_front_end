import axios, { AxiosError, AxiosHeaders } from 'axios'
import { clearAuthTokens, getStoredAuthTokens } from '@/api/auth'
import { BusinessError } from '@/lib/errors'
import { withRetry } from '@/utils/retry'
import { SUCCESS_CODE, type ApiResponse } from '@/api/types'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30_000,
  headers: {
    'Content-Type': 'application/json',
  },
})

const inFlightGets = new Map<string, Promise<unknown>>()

export const getDeduplicated = <T>(url: string, params?: object): Promise<T> => {
  const query = Object.entries(params ?? {})
    .filter(([, value]) => value !== undefined)
    .sort(([left], [right]) => left.localeCompare(right))
  const key = `${url}?${JSON.stringify(query)}`
  const existing = inFlightGets.get(key)

  if (existing) {
    return existing as Promise<T>
  }

  const request = apiClient.get(url, { params }) as Promise<T>
  inFlightGets.set(key, request)
  void request.finally(() => inFlightGets.delete(key))
  return request
}

apiClient.interceptors.request.use(async (config) => {
  const headers = new AxiosHeaders(config.headers)
  const tokens = getStoredAuthTokens()
  if (tokens?.accessToken) {
    headers.set('Authorization', `${tokens.tokenType} ${tokens.accessToken}`)
  }
  config.headers = headers
  return config
})

apiClient.interceptors.response.use(
  (response) => {
    if (response.config.responseType === 'blob') {
      return response
    }

    const payload = response.data as ApiResponse<unknown>
    if (typeof payload?.code === 'number' && payload.code !== SUCCESS_CODE) {
      throw new BusinessError(payload.code, payload.message || 'Business error')
    }
    return response.data
  },
  async (error: AxiosError) => {
    const status = error.response?.status

    if (status === 401) {
      clearAuthTokens()
      if (window.location.pathname !== '/login') {
        window.location.replace('/login')
      }
    }

    if (status === 403) {
      throw new BusinessError(403, 'Permission denied')
    }

    throw error
  },
)

export const requestWithRetry = async <T>(task: () => Promise<T>): Promise<T> => {
  return withRetry(task, { retries: 1, delayMs: 600 })
}
