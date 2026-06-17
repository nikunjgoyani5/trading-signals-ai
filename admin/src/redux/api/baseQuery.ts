import {
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query'
import { clearAccessToken, getAccessToken, setAccessToken } from '../../lib/authStorage'

export function getApiBase(): string {
  // Vercel client deploy: same-origin /api → middleware.ts proxies to server (no CORS)
  if (typeof window !== 'undefined' && /\.vercel\.app$/i.test(window.location.hostname)) {
    return '/api'
  }

  const raw = import.meta.env.VITE_API_BASE_URL ?? '/api'
  const trimmed = raw.replace(/\/$/, '')

  if (trimmed.startsWith('http') && !trimmed.endsWith('/api')) {
    return `${trimmed}/api`
  }

  return trimmed || '/api'
}

let cachedBaseUrl = ''
let cachedRawBaseQuery: ReturnType<typeof fetchBaseQuery> | null = null

function getRawBaseQuery() {
  const baseUrl = getApiBase()

  if (baseUrl !== cachedBaseUrl || !cachedRawBaseQuery) {
    cachedBaseUrl = baseUrl
    cachedRawBaseQuery = fetchBaseQuery({
      baseUrl,
      credentials: 'include',
      prepareHeaders: (headers) => {
        const token = getAccessToken()
        if (token) {
          headers.set('Authorization', `Bearer ${token}`)
        }

        return headers
      },
    })
  }

  return cachedRawBaseQuery
}

type ApiWrapper<T> = {
  success: boolean
  message: string
  data?: T
  errors?: Record<string, string[] | undefined>
}

type QueryError = {
  status: number | 'FETCH_ERROR' | 'CUSTOM_ERROR'
  data: { message: string; errors?: Record<string, string[] | undefined> }
}

function unwrapResponse<T>(result: { data?: unknown; error?: FetchBaseQueryError }): {
  data?: T
  error?: QueryError
} {
  if (result.error) {
    const status = result.error.status === 'FETCH_ERROR' ? 0 : Number(result.error.status)
    const payload = result.error.data as ApiWrapper<unknown> | undefined
    return {
      error: {
        status,
        data: {
          message: payload?.message ?? 'Request failed',
          errors: payload?.errors,
        },
      },
    }
  }

  const wrapper = result.data as ApiWrapper<T> | undefined
  if (!wrapper || !wrapper.success) {
    return {
      error: {
        status: 400,
        data: {
          message: wrapper?.message ?? 'Request failed',
          errors: wrapper?.errors,
        },
      },
    }
  }

  return { data: wrapper.data as T }
}

export const baseQueryWithAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  QueryError
> = async (args, api, extraOptions) => {
  const rawBaseQuery = getRawBaseQuery()
  let result = await rawBaseQuery(args, api, extraOptions)
  let unwrapped = unwrapResponse(result)

  const isAuthRequest =
    typeof args === 'string'
      ? args.includes('/auth/login') || args.includes('/auth/refresh')
      : String(args.url).includes('/auth/login') || String(args.url).includes('/auth/refresh')

  if (unwrapped.error?.status === 401 && !isAuthRequest && getAccessToken()) {
    const refresh = await rawBaseQuery(
      { url: '/auth/refresh', method: 'POST' },
      api,
      extraOptions,
    )
    const refreshData = unwrapResponse<{ accessToken: string }>(refresh)

    if (refreshData.data?.accessToken) {
      const rememberMe = Boolean(localStorage.getItem('tsai.accessToken.remember'))
      setAccessToken(refreshData.data.accessToken, rememberMe)
      result = await rawBaseQuery(args, api, extraOptions)
      unwrapped = unwrapResponse(result)
    } else {
      clearAccessToken()
    }
  }

  if (unwrapped.error) {
    return { error: unwrapped.error }
  }

  return { data: unwrapped.data }
}
