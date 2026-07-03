import type { Request } from 'express'
import { AppError } from './AppError.js'
import { HttpStatus } from '../constants/httpStatus.js'

import type { BlogStatus } from '../constants/blogStatus.js'
import { isBlogStatus } from '../constants/blogStatus.js'

export type ParsedBlogBody = {
  title?: string
  content?: string
  coverImage?: string
  status?: BlogStatus
  aiCoverGenerationCount?: number
}

export type ParsedBlogRequest = {
  body: ParsedBlogBody
  /** Local file from multipart field `coverImage` or `coverImageFile` */
  coverImageFile?: { buffer: Buffer; name: string }
}

function asOptionalString(value: unknown): string | undefined {
  if (value === undefined || value === null) return undefined
  return String(value)
}

function asOptionalNonNegativeInt(value: unknown): number | undefined {
  if (value === undefined || value === null || value === '') return undefined
  const parsed = Number(value)
  if (!Number.isInteger(parsed) || parsed < 0) return undefined
  return parsed
}

function getCoverImageFileFromMulter(req: Request): ParsedBlogRequest['coverImageFile'] {
  if (Array.isArray(req.files)) {
    const coverFile = req.files.find(
      (file) => file.fieldname === 'coverImage' || file.fieldname === 'coverImageFile',
    )
    if (coverFile && coverFile.size > 0) {
      return { buffer: coverFile.buffer, name: coverFile.originalname }
    }
    return undefined
  }

  const files = req.files as Record<string, Express.Multer.File[]> | undefined
  const coverFile = files?.coverImage?.[0] ?? files?.coverImageFile?.[0] ?? req.file

  if (coverFile && coverFile.size > 0) {
    return { buffer: coverFile.buffer, name: coverFile.originalname }
  }

  return undefined
}

/** After multer — build body + file from multipart fields. */
export function buildParsedBlogFromRequest(req: Request): ParsedBlogRequest {
  const raw = req.body as Record<string, unknown>

  const statusRaw = asOptionalString(raw.status)?.toLowerCase()

  return {
    body: {
      title: asOptionalString(raw.title),
      content: asOptionalString(raw.content),
      coverImage: asOptionalString(raw.coverImage),
      status: statusRaw && isBlogStatus(statusRaw) ? statusRaw : undefined,
      aiCoverGenerationCount: asOptionalNonNegativeInt(raw.aiCoverGenerationCount),
    },
    coverImageFile: getCoverImageFileFromMulter(req),
  }
}

/**
 * POST /api/blogs and PUT /api/blogs/:slug
 *
 * multipart: run parseBlogBodyWithMulter first (sets req.blogRequest)
 * JSON: coverImage as base64 data URL
 */
export function parseBlogRequest(req: Request): ParsedBlogRequest {
  if (req.blogRequest) {
    return req.blogRequest
  }

  const contentType = req.headers['content-type'] || ''

  if (contentType.includes('multipart/form-data')) {
    return buildParsedBlogFromRequest(req)
  }

  if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
    throw new AppError(
      'Invalid JSON format in request body. Use application/json or multipart/form-data.',
      HttpStatus.BAD_REQUEST,
    )
  }

  const raw = req.body as Record<string, unknown>

  const statusRaw = asOptionalString(raw.status)?.toLowerCase()

  return {
    body: {
      title: asOptionalString(raw.title),
      content: asOptionalString(raw.content),
      coverImage: asOptionalString(raw.coverImage),
      status: statusRaw && isBlogStatus(statusRaw) ? statusRaw : undefined,
      aiCoverGenerationCount: asOptionalNonNegativeInt(raw.aiCoverGenerationCount),
    },
  }
}
