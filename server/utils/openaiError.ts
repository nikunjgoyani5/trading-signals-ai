const FRIENDLY_BY_CODE: Record<string, string> = {
  insufficient_quota:
    'OpenAI API quota exceeded. Please check your plan and billing details.',
  invalid_api_key: 'OpenAI API key is invalid. Please check server configuration.',
  billing_hard_limit_reached:
    'OpenAI billing limit reached. Please check your account billing settings.',
  rate_limit_exceeded: 'OpenAI rate limit reached. Please wait a moment and try again.',
}

type OpenAIErrorBody = {
  error?: {
    message?: string
    type?: string
    code?: string | null
  }
  message?: string
}

function friendlyForCode(code?: string | null): string | undefined {
  if (!code) return undefined
  return FRIENDLY_BY_CODE[code.toLowerCase()]
}

function extractFromObject(body: OpenAIErrorBody): string | undefined {
  const code = body.error?.code ?? undefined
  const friendly = friendlyForCode(code)
  if (friendly) return friendly

  const message = body.error?.message ?? body.message
  if (typeof message === 'string' && message.trim()) {
    return message.trim()
  }

  return undefined
}

/** Turn raw OpenAI HTTP error bodies into a short user-facing message. */
export function parseOpenAIError(raw: string, fallback = 'AI request failed.'): string {
  const trimmed = raw?.trim()
  if (!trimmed) return fallback

  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    try {
      const parsed = JSON.parse(trimmed) as OpenAIErrorBody
      const message = extractFromObject(parsed)
      if (message) return message
    } catch {
      /* not JSON — use raw text below */
    }
  }

  return trimmed.length > 280 ? `${trimmed.slice(0, 277)}…` : trimmed
}
