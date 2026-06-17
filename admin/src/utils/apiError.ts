import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import type { SerializedError } from '@reduxjs/toolkit'

type ApiErrorPayload = {
  message?: string
  errors?: Record<string, string[] | undefined>
}

const FRIENDLY_BY_CODE: Record<string, string> = {
  insufficient_quota:
    'OpenAI API quota exceeded. Please check your plan and billing details.',
  invalid_api_key: 'OpenAI API key is invalid. Please check server configuration.',
  billing_hard_limit_reached:
    'OpenAI billing limit reached. Please check your account billing settings.',
  rate_limit_exceeded: 'OpenAI rate limit reached. Please wait a moment and try again.',
}

type NestedOpenAIError = {
  error?: {
    message?: string
    code?: string | null
  }
  message?: string
}

function friendlyForCode(code?: string | null): string | undefined {
  if (!code) return undefined
  return FRIENDLY_BY_CODE[code.toLowerCase()]
}

/** Unwrap JSON-stringified API messages (legacy / upstream passthrough). */
function normalizeApiMessage(message: string): string {
  const trimmed = message.trim()
  if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) {
    return trimmed
  }

  try {
    const parsed = JSON.parse(trimmed) as NestedOpenAIError
    const code = parsed.error?.code
    const friendly = friendlyForCode(code)
    if (friendly) return friendly

    const nested = parsed.error?.message ?? parsed.message
    if (typeof nested === 'string' && nested.trim()) {
      return nested.trim()
    }
  } catch {
    /* keep original text */
  }

  return trimmed
}

function messageFromValidationErrors(errors?: Record<string, string[] | undefined>): string | undefined {
  if (!errors) return undefined

  const parts = Object.values(errors)
    .flat()
    .filter((value): value is string => Boolean(value?.trim()))

  return parts.length > 0 ? parts.join(' ') : undefined
}

export function getApiErrorMessage(
  error: unknown,
  fallback = 'Something went wrong',
): string {
  if (!error) return fallback

  if (typeof error === 'object' && error !== null && 'status' in error) {
    const fetchError = error as FetchBaseQueryError
    if (fetchError.data && typeof fetchError.data === 'object') {
      const data = fetchError.data as ApiErrorPayload & { error?: string }
      const validationMessage = messageFromValidationErrors(data.errors)
      if (validationMessage) return validationMessage
      if (data.message) return normalizeApiMessage(data.message)
      if (data.error) return normalizeApiMessage(data.error)
    }
    if (fetchError.status === 0 || fetchError.status === 'FETCH_ERROR') {
      return 'Unable to reach the API server. Make sure the backend is running.'
    }
  }

  if (typeof error === 'object' && error !== null && 'message' in error) {
    const message = (error as SerializedError).message
    return message ? normalizeApiMessage(message) : fallback
  }

  if (error instanceof Error) {
    return normalizeApiMessage(error.message)
  }

  return fallback
}
