import dayjs from 'dayjs'

export const formatDateTime = (input?: string | number | Date): string => {
  if (!input) {
    return '-'
  }
  return dayjs(input).format('YYYY-MM-DD HH:mm:ss')
}
