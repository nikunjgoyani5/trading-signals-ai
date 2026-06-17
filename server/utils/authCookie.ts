import type { Response } from 'express'
import { env } from '../config/env.js'
import { REFRESH_COOKIE_MAX_AGE_MS, REFRESH_TOKEN_COOKIE } from '../constants/auth.js'

export function setRefreshCookie(res: Response, token: string, rememberMe: boolean): void {
  const maxAge = rememberMe
    ? REFRESH_COOKIE_MAX_AGE_MS.remember
    : REFRESH_COOKIE_MAX_AGE_MS.default

  res.cookie(REFRESH_TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge,
    path: '/api/auth',
  })
}

export function clearRefreshCookie(res: Response): void {
  res.clearCookie(REFRESH_TOKEN_COOKIE, { path: '/api/auth' })
}

export function getRefreshTokenFromRequest(cookies: Record<string, unknown> | undefined): string | undefined {
  const value = cookies?.[REFRESH_TOKEN_COOKIE]
  return typeof value === 'string' ? value : undefined
}
