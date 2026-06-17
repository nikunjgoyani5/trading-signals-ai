import { env } from '../config/env.js'
import { isDatabaseConnected } from '../config/database.js'

export function getHealthStatus() {
  const dbConnected = isDatabaseConnected()

  return {
    status: dbConnected ? 'ok' : 'degraded',
    environment: env.NODE_ENV,
    dbConnected,
    timestamp: new Date().toISOString(),
  }
}
