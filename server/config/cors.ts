import type { CorsOptions } from 'cors'
import { env } from './env.js'

function normalizeOrigin(origin: string): string {
  return origin.trim().replace(/\/$/, '')
}

function collectExplicitOrigins(): Set<string> {
  const origins = new Set<string>()

  for (const part of env.CORS_ORIGIN.split(',')) {
    const normalized = normalizeOrigin(part)
    if (normalized) origins.add(normalized)
  }

  if (env.CLIENT_URL) {
    origins.add(normalizeOrigin(env.CLIENT_URL))
  }

  if (env.LANDING_PAGE_URL) {
    origins.add(normalizeOrigin(env.LANDING_PAGE_URL))
  }

  return origins
}

const explicitOrigins = collectExplicitOrigins()

/** Any *.vercel.app deployment (preview + production) */
const VERCEL_APP_ORIGIN = /^https:\/\/[\w-]+\.vercel\.app$/i

/** Team-specific Vercel URLs */
const VERCEL_TEAM_ORIGIN = /^https:\/\/[\w-]+-manav01logicgo-3215s-projects\.vercel\.app$/i

/** Production landing site */
const TRADING_SIGNALS_ORIGIN =
  /^https:\/\/([\w-]+\.)?tradingsignals\.ai$/i

function isLocalDevOrigin(origin: string): boolean {
  if (env.NODE_ENV !== 'development') {
    return false
  }

  try {
    const { hostname } = new URL(origin)
    return hostname === 'localhost' || hostname === '127.0.0.1'
  } catch {
    return false
  }
}

function isAllowedOrigin(origin: string): boolean {
  const normalized = normalizeOrigin(origin)

  if (explicitOrigins.has(normalized)) {
    return true
  }

  if (isLocalDevOrigin(normalized)) {
    return true
  }

  if (TRADING_SIGNALS_ORIGIN.test(normalized)) {
    return true
  }

  const allowPreviews = process.env.CORS_ALLOW_VERCEL_PREVIEWS !== 'false'
  if (allowPreviews && (VERCEL_APP_ORIGIN.test(normalized) || VERCEL_TEAM_ORIGIN.test(normalized))) {
    return true
  }

  return false
}

export const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (!origin) {
      callback(null, true)
      return
    }

    if (isAllowedOrigin(origin)) {
      callback(null, true)
      return
    }

    console.warn(`[cors] Blocked origin: ${origin}`)
    callback(null, false)
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'x-vercel-protection-bypass',
    'X-Requested-With',
  ],
  optionsSuccessStatus: 204,
}
