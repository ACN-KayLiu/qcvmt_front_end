import type { PageParams, PageResponse } from '@/api/types'

const defaultPage = 0
const defaultSize = 10

export const toPageResponse = <T>(
  items: T[],
  params?: PageParams,
): PageResponse<T> => {
  const page = Math.max(params?.page ?? defaultPage, 0)
  const size = Math.max(params?.size ?? defaultSize, 1)
  const start = page * size
  const content = items.slice(start, start + size)
  const totalElements = items.length
  const totalPages = Math.ceil(totalElements / size)

  return {
    content,
    totalElements,
    totalPages,
    number: page,
    size,
  }
}

export const byKeyword = <T>(
  items: T[],
  keyword: string | undefined,
  fields: Array<(item: T) => string | undefined>,
): T[] => {
  const normalized = keyword?.trim().toLowerCase()
  if (!normalized) {
    return items
  }

  return items.filter((item) =>
    fields.some((field) => (field(item) || '').toLowerCase().includes(normalized)),
  )
}
