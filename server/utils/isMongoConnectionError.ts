export function isMongoConnectionError(error: unknown): boolean {
  if (!(error instanceof Error)) return false

  const message = error.message.toLowerCase()
  return (
    message.includes('mongodb') ||
    message.includes('querysrv') ||
    message.includes('enotfound') ||
    message.includes('mongoose') ||
    message.includes('timed out') ||
    message.includes('econnrefused')
  )
}
