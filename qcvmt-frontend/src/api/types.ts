export interface ApiResponse<T> {
  code: number
  message: string
  data: T
  timestamp: number
}

export interface PageParams {
  page?: number
  size?: number
  keyword?: string
}

export interface PageResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
}

export const SUCCESS_CODE = 200
