import { apiClient, getDeduplicated } from '@/lib/axios'
import type { ApiResponse, PageParams, PageResponse } from '@/api/types'
import type { ColorSet, CreateColorSetRequest, UpdateColorSetRequest } from '@/types/colorSet'

export const colorSetApi = {
  detail: (id: number): Promise<ApiResponse<ColorSet>> => apiClient.get(`/color-sets/${id}`),
  list: (params?: PageParams): Promise<ApiResponse<PageResponse<ColorSet>>> =>
    getDeduplicated('/color-sets', params),
  create: (data: CreateColorSetRequest): Promise<ApiResponse<ColorSet>> =>
    apiClient.post('/color-sets', data),
  update: (id: number, data: UpdateColorSetRequest): Promise<ApiResponse<ColorSet>> =>
    apiClient.put(`/color-sets/${id}`, data),
  remove: (id: number): Promise<ApiResponse<void>> => apiClient.delete(`/color-sets/${id}`),
}
