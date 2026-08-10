export class BusinessError extends Error {
  readonly code: number

  constructor(code: number, message: string) {
    super(message)
    this.name = 'BusinessError'
    this.code = code
  }
}

export const isNetworkError = (error: unknown): boolean => {
  return error instanceof Error && /Network Error|timeout/i.test(error.message)
}
