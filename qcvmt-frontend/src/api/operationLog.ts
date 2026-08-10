import { apiClient } from '@/lib/axios'
import type { ApiResponse, PageParams, PageResponse } from '@/api/types'
import type { OperationLogItem } from '@/types/user'

export const operationLogApi = {
  list: (params?: PageParams): Promise<ApiResponse<PageResponse<OperationLogItem>>> =>
    apiClient.get('/operation-logs', { params }),
}
