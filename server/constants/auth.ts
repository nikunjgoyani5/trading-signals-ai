export const REFRESH_TOKEN_COOKIE = 'refreshToken'

export const REFRESH_COOKIE_MAX_AGE_MS = {
  default: 7 * 24 * 60 * 60 * 1000,
  remember: 30 * 24 * 60 * 60 * 1000,
} as const
