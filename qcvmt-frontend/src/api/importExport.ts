import { apiClient } from '@/lib/axios'
import type { ApiResponse } from '@/api/types'
import type { AxiosResponse } from 'axios'

interface ImportResult {
  total: number
  success: number
  failed: number
}

interface ExportResult {
  blob: Blob
  filename?: string
}

const parseFilenameFromContentDisposition = (value?: string): string | undefined => {
  if (!value) {
    return undefined
  }

  const utf8Match = value.match(/filename\*=UTF-8''([^;]+)/i)
  if (utf8Match?.[1]) {
    try {
      return decodeURIComponent(utf8Match[1])
    } catch {
      return utf8Match[1]
    }
  }

  const plainMatch = value.match(/filename="?([^";]+)"?/i)
  return plainMatch?.[1]
}

export const importExportApi = {
  importVessel: (file: File): Promise<ApiResponse<ImportResult>> => {
    const formData = new FormData()
    formData.append('file', file)
    return apiClient.post('/import/vessel', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  exportLogs: async (from: string, to: string): Promise<ExportResult> => {
    const response = (await apiClient.get('/export/logs', {
      params: { from, to },
      responseType: 'blob',
    })) as AxiosResponse<Blob>

    const filename = parseFilenameFromContentDisposition(
      response.headers['content-disposition'] as string | undefined,
    )

    return {
      blob: response.data,
      filename,
    }
  },
}
