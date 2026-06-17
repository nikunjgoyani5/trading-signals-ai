import type { Request, Response } from 'express'
import * as dashboardService from '../services/dashboard.service.js'
import { sendSuccess } from '../utils/sendResponse.js'

export async function getAnalytics(_req: Request, res: Response): Promise<void> {
  const data = await dashboardService.getDashboardAnalytics()
  sendSuccess(res, data, 'Dashboard analytics loaded')
}