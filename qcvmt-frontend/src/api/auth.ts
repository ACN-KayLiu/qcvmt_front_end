import { apiClient } from '@/lib/axios'
import type { ApiResponse } from '@/api/types'

export interface LoginRequest {
  username: string
  password: string
}

export const authApi = {
  login: (data: LoginRequest): Promise<ApiResponse<void>> => apiClient.post('/auth/login', data),
  logout: (): Promise<ApiResponse<void>> => apiClient.post('/auth/logout'),
}
