import { useState } from 'react'
import type { TablePaginationConfig } from 'antd/es/table'

export interface ListQueryState {
  page: number
  size: number
  keyword: string
}

interface UseListQueryOptions {
  initialPage?: number
  initialSize?: number
  initialKeyword?: string
}

export const useListQuery = (options: UseListQueryOptions = {}) => {
  const {
    initialPage = 1,
    initialSize = 10,
    initialKeyword = '',
  } = options

  const [query, setQuery] = useState<ListQueryState>({
    page: initialPage,
    size: initialSize,
    keyword: initialKeyword,
  })
  const [inputKeyword, setInputKeyword] = useState(initialKeyword)

  const handleSearch = () => {
    setQuery((prev) => ({ ...prev, keyword: inputKeyword.trim(), page: 1 }))
  }

  const handlePageChange = (pagination: TablePaginationConfig) => {
    setQuery((prev) => ({
      ...prev,
      page: pagination.current || 1,
      size: pagination.pageSize || prev.size,
    }))
  }

  return {
    query,
    setQuery,
    inputKeyword,
    setInputKeyword,
    handleSearch,
    handlePageChange,
  }
}
