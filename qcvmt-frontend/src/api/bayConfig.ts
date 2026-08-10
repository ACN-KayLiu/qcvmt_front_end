import { apiClient } from '@/lib/axios'
import type { ApiResponse } from '@/api/types'
import type { BayConfig } from '@/types/bayConfig'

export const bayConfigApi = {
  get: (): Promise<ApiResponse<BayConfig>> => apiClient.get('/bay-config'),
  update: (data: BayConfig): Promise<ApiResponse<BayConfig>> => apiClient.put('/bay-config', data),
}
