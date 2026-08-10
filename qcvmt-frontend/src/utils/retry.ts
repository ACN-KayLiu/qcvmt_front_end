export interface RetryOptions {
  retries?: number
  delayMs?: number
}

const wait = (delayMs: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, delayMs)
  })

export const withRetry = async <T>(
  task: () => Promise<T>,
  options: RetryOptions = {},
): Promise<T> => {
  const retries = options.retries ?? 1
  const delayMs = options.delayMs ?? 500
  let lastError: unknown

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await task()
    } catch (error) {
      lastError = error
      if (attempt < retries) {
        await wait(delayMs)
      }
    }
  }

  throw lastError
}
