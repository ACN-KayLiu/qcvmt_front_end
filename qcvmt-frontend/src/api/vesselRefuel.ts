import { apiClient, getDeduplicated } from '@/lib/axios'
import type { ApiResponse, PageParams, PageResponse } from '@/api/types'
import type { VesselRefuelItem } from '@/types/bayConfig'

export const vesselRefuelApi = {
  detail: (id: number): Promise<ApiResponse<VesselRefuelItem>> => apiClient.get(`/vessel-refuels/${id}`),
  list: (params?: PageParams): Promise<ApiResponse<PageResponse<VesselRefuelItem>>> =>
    getDeduplicated('/vessel-refuels', params),
  create: (data: Omit<VesselRefuelItem, 'id' | 'version'>): Promise<ApiResponse<VesselRefuelItem>> =>
    apiClient.post('/vessel-refuels', data),
  update: (id: number, data: Pick<VesselRefuelItem, 'isRefuel'>): Promise<ApiResponse<VesselRefuelItem>> =>
    apiClient.put(`/vessel-refuels/${id}`, data),
  remove: (id: number): Promise<ApiResponse<void>> => apiClient.delete(`/vessel-refuels/${id}`),
}
