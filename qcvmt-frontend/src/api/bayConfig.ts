import { apiClient } from '@/lib/axios'
import type { ApiResponse } from '@/api/types'
import type { BayConfig } from '@/types/bayConfig'

export const bayConfigApi = {
  get: async (): Promise<ApiResponse<BayConfig>> => {
    const response = await apiClient.get('/cell-matrix') as ApiResponse<BayConfig[]>
    const first = response.data[0]
    if (!first) {
      return {
        ...response,
        data: {
          id: 0,
          type: 'HOLD',
          row: '0',
          tier: '0',
          tierStart: '0',
          tierEnd: '0',
          active: '1',
        },
      }
    }

    return {
      ...response,
      data: first,
    }
  },
  update: (data: BayConfig): Promise<ApiResponse<BayConfig>> => apiClient.put(`/cell-matrix/${data.id}`, data),
}
