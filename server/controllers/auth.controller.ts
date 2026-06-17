import type { Request, Response } from 'express'
import * as authService from '../services/auth.service.js'
import {
  clearRefreshCookie,
  getRefreshTokenFromRequest,
  setRefreshCookie,
} from '../utils/authCookie.js'
import { sendSuccess } from '../utils/sendResponse.js'

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password, rememberMe } = req.body

  const result = await authService.login(email, password, rememberMe)
  setRefreshCookie(res, result.refreshToken, rememberMe)

  sendSuccess(
    res,
    { user: result.user, accessToken: result.accessToken, rememberMe: result.rememberMe },
    'Signed in successfully',
  )
}

export async function refresh(req: Request, res: Response): Promise<void> {
  const refreshToken = getRefreshTokenFromRequest(req.cookies)
  const data = await authService.refreshSession(refreshToken)
  sendSuccess(res, data, 'Session refreshed')
}

export async function logout(_req: Request, res: Response): Promise<void> {
  clearRefreshCookie(res)
  sendSuccess(res, null, 'Signed out successfully')
}

export async function me(req: Request, res: Response): Promise<void> {
  const data = await authService.getProfile(req.user!.id)
  sendSuccess(res, data, 'Profile loaded')
}

export async function forgotPassword(req: Request, res: Response): Promise<void> {
  const { email } = req.body
  const requestOrigin = typeof req.headers.origin === 'string' ? req.headers.origin : undefined
  const data = await authService.requestPasswordReset(email, requestOrigin)
  sendSuccess(res, data, data.message)
}

export async function resetPassword(req: Request, res: Response): Promise<void> {
  const { token, password } = req.body
  const data = await authService.resetPassword(token, password)
  sendSuccess(res, data, data.message)
}
