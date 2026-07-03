import crypto from 'node:crypto'

/** Human-readable ticket id, e.g. TSAI-20260625-A1B2C3 */
export function generateTicketNumber(): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  const suffix = crypto.randomBytes(3).toString('hex').toUpperCase()
  return `TSAI-${date}-${suffix}`
}
