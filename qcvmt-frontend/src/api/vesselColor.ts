import { apiClient } from '@/lib/axios'
import type { ApiResponse, PageParams, PageResponse } from '@/api/types'
import type { VesselColorItem } from '@/types/bayConfig'

export const vesselColorApi = {
  detail: (id: number): Promise<ApiResponse<VesselColorItem>> => apiClient.get(`/vessel-colors/${id}`),
  list: (params?: PageParams): Promise<ApiResponse<PageResponse<VesselColorItem>>> =>
    apiClient.get('/vessel-colors', { params }),
  create: (data: Omit<VesselColorItem, 'id'>): Promise<ApiResponse<VesselColorItem>> =>
    apiClient.post('/vessel-colors', data),
  update: (id: number, data: Omit<VesselColorItem, 'id'>): Promise<ApiResponse<VesselColorItem>> =>
    apiClient.put(`/vessel-colors/${id}`, data),
  remove: (id: number): Promise<ApiResponse<void>> => apiClient.delete(`/vessel-colors/${id}`),
}
