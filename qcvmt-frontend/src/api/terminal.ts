import { apiClient, requestWithRetry } from '@/lib/axios'
import type { ApiResponse } from '@/api/types'
import type { TerminalView } from '@/types/terminal'

export const terminalApi = {
  query: async (qcNum: string, signal?: AbortSignal): Promise<ApiResponse<TerminalView>> => {
    return requestWithRetry(() =>
      apiClient.get('/terminal/query', {
        params: { qcNum },
        signal,
      }),
    )
  },
}
