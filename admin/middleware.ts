/**
 * Same-origin API proxy on Vercel — avoids browser CORS + OPTIONS preflight to the server.
 * Set on the CLIENT Vercel project (server-side env, not VITE_*):
 *   API_SERVER_URL=https://trading-signal-admin-2-git-779170-manav01logicgo-3215s-projects.vercel.app
 *   VERCEL_PROTECTION_BYPASS=your-token (if server preview is protected)
 */
export const config = {
  matcher: '/api/:path*',
}

const DEFAULT_API_SERVER =
  'https://trading-signal-admin-2-git-779170-manav01logicgo-3215s-projects.vercel.app'

export default async function middleware(request: Request): Promise<Response> {
  const apiServer = (process.env.API_SERVER_URL ?? DEFAULT_API_SERVER).replace(/\/$/, '')
  const bypass = process.env.VERCEL_PROTECTION_BYPASS?.trim()

  const incoming = new URL(request.url)
  const target = `${apiServer}${incoming.pathname}${incoming.search}`

  const headers = new Headers(request.headers)
  headers.delete('host')
  if (bypass) {
    headers.set('x-vercel-protection-bypass', bypass)
  }

  const init: RequestInit & { duplex?: 'half' } = {
    method: request.method,
    headers,
  }

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    init.body = request.body
    init.duplex = 'half'
  }

  return fetch(target, init)
}
