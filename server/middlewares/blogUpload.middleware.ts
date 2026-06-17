import multer from 'multer'
import type { NextFunction, Request, Response } from 'express'
import { AppError } from '../utils/AppError.js'
import { HttpStatus } from '../constants/httpStatus.js'
import { buildParsedBlogFromRequest } from '../utils/parseBlogBody.js'

const ALLOWED_FILE_FIELDS = new Set(['coverImage', 'coverImageFile'])

function validateCoverFileFields(req: Request): AppError | null {
  const files = Array.isArray(req.files) ? req.files : []
  const invalid = files.find((file) => !ALLOWED_FILE_FIELDS.has(file.fieldname))

  if (invalid) {
    return new AppError(
      `Unexpected file field "${invalid.fieldname}". Use coverImage or coverImageFile for the image. Set "content" as Type Text, not File.`,
      HttpStatus.BAD_REQUEST,
    )
  }

  return null
}

const blogMulter = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
    fieldSize: 10 * 1024 * 1024,
    files: 2,
  },
})

/**
 * Accept cover file + all text fields (title, content, etc.).
 * Uses .any() so text fields are always parsed into req.body (Postman form-data).
 */
const parseMultipartFields = blogMulter.any()

function isMultipart(req: Request): boolean {
  return (req.headers['content-type'] || '').includes('multipart/form-data')
}

function multerErrorToAppError(err: unknown): AppError {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return new AppError('Cover image must be 10 MB or smaller', HttpStatus.BAD_REQUEST)
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return new AppError(
        'Unexpected file field. Use coverImage or coverImageFile for the cover image only.',
        HttpStatus.BAD_REQUEST,
      )
    }
    return new AppError(err.message, HttpStatus.BAD_REQUEST)
  }

  if (err instanceof Error) {
    if (/field value too long/i.test(err.message)) {
      return new AppError(
        'Blog content or cover image is too large. Use a smaller cover image or regenerate content without embedded images.',
        HttpStatus.BAD_REQUEST,
      )
    }
    return new AppError(err.message, HttpStatus.BAD_REQUEST)
  }

  return new AppError('Failed to parse blog upload', HttpStatus.BAD_REQUEST)
}

/**
 * Parses multipart blog body: title, content, coverImage (text or file).
 * JSON requests skip this middleware (handled by express.json).
 */
export function parseBlogBodyWithMulter(req: Request, res: Response, next: NextFunction): void {
  if (!isMultipart(req)) {
    next()
    return
  }

  parseMultipartFields(req, res, (err: unknown) => {
    if (err) {
      next(multerErrorToAppError(err))
      return
    }

    try {
      const coverFieldError = validateCoverFileFields(req)
      if (coverFieldError) {
        next(coverFieldError)
        return
      }

      req.blogRequest = buildParsedBlogFromRequest(req)
      next()
    } catch (error) {
      next(error)
    }
  })
}

/** @deprecated Use parseBlogBodyWithMulter on routes */
export const blogUpload = blogMulter
