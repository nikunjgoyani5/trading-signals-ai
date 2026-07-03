import { env } from '../config/env.js'
import { AppError } from '../utils/AppError.js'
import { HttpStatus } from '../constants/httpStatus.js'
import { parseOpenAIError } from '../utils/openaiError.js'
import { urlToBase64 } from '../utils/imageUtils.js'
import { Blog } from '../models/blog.model.js'
import {
  getMaxBlogAiCoverGenerations,
} from '../constants/blogCoverGeneration.js'
import mongoose from 'mongoose'
import { buildCoverImagePrompt } from '../utils/coverImagePrompt.js'

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
      prompt: buildCoverImagePrompt(prompt),
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
export async function generateCoverImage(
  prompt: string,
  options?: { blogId?: string },
): Promise<{ url: string; aiCoverGenerationCount?: number; maxAiCoverGenerations: number }> {
  const trimmed = prompt?.trim()
  if (!trimmed) {
    throw new AppError('Prompt is required to generate an image.', HttpStatus.BAD_REQUEST)
  }

  if (!env.OPENAI_API_KEY) {
    throw new AppError('OPENAI_API_KEY is not configured.', HttpStatus.INTERNAL_SERVER_ERROR)
  }

  const maxGenerations = getMaxBlogAiCoverGenerations()
  let reservedBlogId: string | null = null

  if (options?.blogId) {
    if (!mongoose.Types.ObjectId.isValid(options.blogId)) {
      throw new AppError('Invalid blog id.', HttpStatus.BAD_REQUEST)
    }

    const reserved = await Blog.findOneAndUpdate(
      {
        _id: options.blogId,
        $expr: { $lt: [{ $ifNull: ['$aiCoverGenerationCount', 0] }, maxGenerations] },
      },
      { $inc: { aiCoverGenerationCount: 1 } },
      { new: true },
    )

    if (!reserved) {
      const existing = await Blog.findById(options.blogId).select('aiCoverGenerationCount')
      if (!existing) {
        throw new AppError('Blog not found.', HttpStatus.NOT_FOUND)
      }
      const currentCount = existing.aiCoverGenerationCount ?? 0
      if (currentCount >= maxGenerations) {
        throw new AppError(
          `AI cover generation limit reached (${maxGenerations} per blog). Upload an image instead.`,
          HttpStatus.TOO_MANY_REQUESTS,
        )
      }
      throw new AppError(
        'Unable to reserve AI cover generation slot. Please try again.',
        HttpStatus.CONFLICT,
      )
    }

    reservedBlogId = String(reserved._id)
  }

  let lastError: string | null = null

  try {
    for (const model of getModelsToTry()) {
      try {
        const image = await requestImage(model, trimmed)
        if (!image) continue

        const url = await toDataImageUrl(image)

        if (reservedBlogId) {
          const blog = await Blog.findById(reservedBlogId).select('aiCoverGenerationCount')
          return {
            url,
            aiCoverGenerationCount: blog?.aiCoverGenerationCount ?? maxGenerations,
            maxAiCoverGenerations: maxGenerations,
          }
        }

        return { url, maxAiCoverGenerations: maxGenerations }
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
  } catch (error) {
    if (reservedBlogId) {
      await Blog.updateOne({ _id: reservedBlogId }, { $inc: { aiCoverGenerationCount: -1 } })
    }
    throw error
  }
}
