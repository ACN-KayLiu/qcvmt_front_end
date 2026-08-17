export const normalizeQcDigits = (value: string): string => {
  return value.trim().replace(/^qc/i, '').replace(/\D/g, '')
}

export const toQcId = (value: string): string => {
  const digits = normalizeQcDigits(value)
  return digits ? `QC${digits}` : ''
}