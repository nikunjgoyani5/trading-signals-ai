import { env } from '../config/env.js'
import { AppError } from '../utils/AppError.js'
import { HttpStatus } from '../constants/httpStatus.js'
import { parseOpenAIError } from '../utils/openaiError.js'
import { urlToBase64 } from '../utils/imageUtils.js'

const COVER_PROMPT = (topic: string) =>
  `A natural, candid photograph for a blog cover about: ${topic}.

The image should look like a real, everyday photo taken by a human:
slightly imperfect composition
natural lighting (not cinematic or dramatic)
realistic environment (home office, workplace, desk setup)
minor clutter, irregular details, lived-in feel

Include:
a real person or realistic workspace
normal objects (laptop, coffee mug, notebook, monitors)

Camera style:
shot on a phone or DSLR (35mm or 50mm)
slight grain, natural shadows, no dramatic effects

Avoid completely:
anything futuristic or sci-fi
perfect symmetry or overly clean setups
glowing lights, neon effects
ultra sharp HDR, over-processed look
CGI, 3D render, digital art, concept art
“AI aesthetic” (too polished, too perfect)

Style reference:
looks like a casual Unsplash or candid LinkedIn photo

Output:
realistic, slightly imperfect, human feel
16:9 aspect ratio`

type ImageGenerationResponse = {
  data?: Array<{ url?: string; b64_json?: string }>
  error?: { message?: string }
}

const FALLBACK_MODELS = ['gpt-image-1', 'dall-e-2', 'dall-e-3'] as const

function getModelsToTry(): string[] {
  const preferred = env.OPENAI_IMAGE_MODEL?.trim()
  if (!preferred) return [...FALLBACK_MODELS]
  return [preferred, ...FALLBACK_MODELS.filter((m) => m !== preferred)]
}

async function toDataImageUrl(image: { url?: string; b64_json?: string }): Promise<string> {
  if (image.b64_json) {
    return `data:image/png;base64,${image.b64_json}`
  }

  if (image.url?.startsWith('http')) {
    return urlToBase64(image.url)
  }

  throw new AppError('No image was generated. Please try again.', HttpStatus.BAD_GATEWAY)
}

async function requestImage(
  model: string,
  prompt: string,
): Promise<{ url?: string; b64_json?: string } | null> {
  const apiKey = env.OPENAI_API_KEY
  if (!apiKey) return null

  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      prompt: COVER_PROMPT(prompt),
      n: 1,
      size: '1024x1024',
    }),
  })

  const data = (await response.json().catch(() => ({}))) as ImageGenerationResponse

  if (!response.ok) {
    const message = data.error?.message ?? ''
    if (message.includes('does not exist') || message.includes('model')) {
      return null
    }
    const friendly = parseOpenAIError(
      JSON.stringify(data.error ? { error: data.error } : data),
      'Image generation failed.',
    )
    throw new AppError(friendly, response.status as number)
  }

  return data.data?.[0] ?? null
}

/** Returns a base64 data URL for preview in the UI — nothing saved on disk. */
export async function generateCoverImage(prompt: string): Promise<{ url: string }> {
  const trimmed = prompt?.trim()
  if (!trimmed) {
    throw new AppError('Prompt is required to generate an image.', HttpStatus.BAD_REQUEST)
  }

  if (!env.OPENAI_API_KEY) {
    throw new AppError('OPENAI_API_KEY is not configured.', HttpStatus.INTERNAL_SERVER_ERROR)
  }

  let lastError: string | null = null

  for (const model of getModelsToTry()) {
    try {
      const image = await requestImage(model, trimmed)
      if (!image) continue

      const url = await toDataImageUrl(image)
      return { url }
    } catch (error) {
      lastError = error instanceof Error ? error.message : 'Image generation failed'
      if (error instanceof AppError && error.statusCode < 500) {
        throw error
      }
    }
  }

  throw new AppError(
    lastError || 'No image model available. Check OPENAI_API_KEY or OPENAI_IMAGE_MODEL.',
    HttpStatus.BAD_GATEWAY,
  )
}
