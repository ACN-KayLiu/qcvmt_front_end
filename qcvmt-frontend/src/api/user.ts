import { apiClient, getDeduplicated } from '@/lib/axios'
import type { ApiResponse, PageParams, PageResponse } from '@/api/types'
import type { CreateUserRequest, OperationLogItem, UpdateUserRequest, User } from '@/types/user'

export const userApi = {
  detail: (id: number): Promise<ApiResponse<User>> => apiClient.get(`/users/${id}`),
  list: (params?: PageParams): Promise<ApiResponse<PageResponse<User>>> =>
    getDeduplicated('/users', params),
  create: (data: CreateUserRequest): Promise<ApiResponse<User>> => apiClient.post('/users', data),
  update: (id: number, data: UpdateUserRequest): Promise<ApiResponse<User>> =>
    apiClient.put(`/users/${id}`, data),
  remove: (id: number): Promise<ApiResponse<void>> => apiClient.delete(`/users/${id}`),
  logs: (id: number, params?: PageParams): Promise<ApiResponse<PageResponse<OperationLogItem>>> =>
    getDeduplicated('/operation-logs', { ...params, userId: id }),
}
