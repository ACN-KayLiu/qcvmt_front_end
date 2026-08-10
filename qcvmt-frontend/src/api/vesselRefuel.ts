import { apiClient } from '@/lib/axios'
import type { ApiResponse, PageParams, PageResponse } from '@/api/types'
import type { VesselRefuelItem } from '@/types/bayConfig'

export const vesselRefuelApi = {
  detail: (id: number): Promise<ApiResponse<VesselRefuelItem>> => apiClient.get(`/vessel-refuels/${id}`),
  list: (params?: PageParams): Promise<ApiResponse<PageResponse<VesselRefuelItem>>> =>
    apiClient.get('/vessel-refuels', { params }),
  create: (data: Omit<VesselRefuelItem, 'id'>): Promise<ApiResponse<VesselRefuelItem>> =>
    apiClient.post('/vessel-refuels', data),
  update: (id: number, data: Omit<VesselRefuelItem, 'id'>): Promise<ApiResponse<VesselRefuelItem>> =>
    apiClient.put(`/vessel-refuels/${id}`, data),
  remove: (id: number): Promise<ApiResponse<void>> => apiClient.delete(`/vessel-refuels/${id}`),
}
