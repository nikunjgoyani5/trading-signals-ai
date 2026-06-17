import type { Request, Response } from 'express'
import { getHealthStatus } from '../services/health.service.js'
import { sendSuccess } from '../utils/sendResponse.js'

export function healthCheck(_req: Request, res: Response): void {
  const data = getHealthStatus()
  sendSuccess(res, data, 'Server is healthy')
}
