import { apiClient } from '@/lib/axios'
import type { ApiResponse, PageParams, PageResponse } from '@/api/types'
import type { CreateVesselRequest, UpdateVesselRequest, Vessel } from '@/types/vessel'

export const vesselApi = {
  detail: (id: number): Promise<ApiResponse<Vessel>> => apiClient.get(`/vessels/${id}`),
  list: (params?: PageParams): Promise<ApiResponse<PageResponse<Vessel>>> =>
    apiClient.get('/vessels', { params }),
  create: (data: CreateVesselRequest): Promise<ApiResponse<Vessel>> => apiClient.post('/vessels', data),
  update: (id: number, data: UpdateVesselRequest): Promise<ApiResponse<Vessel>> =>
    apiClient.put(`/vessels/${id}`, data),
  remove: (id: number): Promise<ApiResponse<void>> => apiClient.delete(`/vessels/${id}`),
}
