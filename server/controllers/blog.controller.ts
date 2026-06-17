import type { Request, Response } from 'express'
import { HttpStatus } from '../constants/httpStatus.js'
import * as blogService from '../services/blog.service.js'
import { AppError } from '../utils/AppError.js'
import { validateBlogData } from '../utils/blogValidation.js'
import { parseBlogRequest } from '../utils/parseBlogBody.js'
import { hasBlogCoverInRequest } from '../utils/persistBlogCover.js'
import { decodeBlogIdentifier } from '../utils/blogIdentifier.js'
import { sendError, sendSuccess } from '../utils/sendResponse.js'

function getRouteIdentifier(req: Request): string {
  if (typeof req.query.title === 'string' && req.query.title.trim()) {
    return decodeBlogIdentifier(req.query.title)
  }
  return decodeBlogIdentifier(String(req.params.slug))
}

function parsePage(value: unknown, fallback: number): number {
  const parsed = parseInt(String(value ?? fallback), 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

function parseSearchQuery(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : undefined
}

function parseStatusQuery(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim().toLowerCase()
  return trimmed.length > 0 ? trimmed : undefined
}

export async function listBlogs(req: Request, res: Response): Promise<void> {
  const page = parsePage(req.query.page, 1)
  const limit = parsePage(req.query.limit, 12)
  const search = parseSearchQuery(req.query.search)
  const status = parseStatusQuery(req.query.status)

  const result = await blogService.listBlogs(page, limit, search, status)
  sendSuccess(res, result, 'Blogs loaded')
}

export async function listPublicBlogs(req: Request, res: Response): Promise<void> {
  const page = parsePage(req.query.page, 1)
  const limit = parsePage(req.query.limit, 12)

  const result = await blogService.listPublicBlogs(page, limit)
  sendSuccess(res, result, 'Published blogs loaded')
}

export async function getBlog(req: Request, res: Response): Promise<void> {
  const blog = await blogService.getBlogByIdentifier(getRouteIdentifier(req))
  sendSuccess(res, blog, 'Blog loaded')
}

export async function getPublicBlog(req: Request, res: Response): Promise<void> {
  const blog = await blogService.getPublicBlogByIdentifier(getRouteIdentifier(req))
  sendSuccess(res, blog, 'Blog loaded')
}

export async function createBlog(req: Request, res: Response): Promise<void> {
  try {
    const { body, coverImageFile } = parseBlogRequest(req)
    const validationErrors = validateBlogData(body, false, { hasCoverFile: !!coverImageFile })

    if (validationErrors) {
      sendError(res, 'Validation Failed', HttpStatus.BAD_REQUEST, { details: validationErrors })
      return
    }

    const blog = await blogService.createBlog(body, coverImageFile)
    sendSuccess(res, blog, 'Blog created', HttpStatus.CREATED)
  } catch (error) {
    if (error instanceof AppError) {
      sendError(res, error.message, error.statusCode)
      return
    }

    console.error('Error saving blog:', error)
    const message = error instanceof Error ? error.message : 'Failed to save blog'
    const status =
      message.includes('JSON') || message.includes('Multer') || message.includes('Cover image')
        ? HttpStatus.BAD_REQUEST
        : HttpStatus.INTERNAL_SERVER_ERROR
    sendError(res, message, status)
  }
}

export async function updateBlog(req: Request, res: Response): Promise<void> {
  try {
    const identifier = getRouteIdentifier(req)
    const { body, coverImageFile } = parseBlogRequest(req)

    const validationErrors = validateBlogData(body, true, {
      hasCoverFile: !!coverImageFile,
      hasCoverInRequest: hasBlogCoverInRequest(body, coverImageFile),
    })

    if (validationErrors) {
      sendError(res, 'Validation Failed', HttpStatus.BAD_REQUEST, { details: validationErrors })
      return
    }

    const blog = await blogService.updateBlog(identifier, body, coverImageFile)
    sendSuccess(res, blog, 'Blog updated')
  } catch (error) {
    if (error instanceof AppError) {
      sendError(res, error.message, error.statusCode)
      return
    }

    console.error('Error updating blog:', error)
    const message = error instanceof Error ? error.message : 'Failed to update blog'
    const status = message.includes('JSON') ? HttpStatus.BAD_REQUEST : HttpStatus.INTERNAL_SERVER_ERROR
    sendError(res, message, status)
  }
}

export async function publishBlog(req: Request, res: Response): Promise<void> {
  try {
    const blog = await blogService.publishBlog(getRouteIdentifier(req))
    sendSuccess(res, blog, 'Blog published')
  } catch (error) {
    if (error instanceof AppError) {
      sendError(res, error.message, error.statusCode)
      return
    }
    sendError(res, 'Failed to publish blog', HttpStatus.INTERNAL_SERVER_ERROR)
  }
}

export async function archiveBlog(req: Request, res: Response): Promise<void> {
  try {
    const blog = await blogService.archiveBlog(getRouteIdentifier(req))
    sendSuccess(res, blog, 'Blog archived')
  } catch (error) {
    if (error instanceof AppError) {
      sendError(res, error.message, error.statusCode)
      return
    }
    sendError(res, 'Failed to archive blog', HttpStatus.INTERNAL_SERVER_ERROR)
  }
}

export async function deleteBlog(req: Request, res: Response): Promise<void> {
  try {
    const identifier = getRouteIdentifier(req)
    await blogService.deleteBlog(identifier)
    sendSuccess(res, { message: 'Blog deleted successfully' }, 'Blog deleted')
  } catch (error) {
    if (error instanceof AppError) {
      sendError(res, error.message, error.statusCode)
      return
    }

    console.error('Error deleting blog:', error)
    sendError(res, 'Failed to delete blog', HttpStatus.INTERNAL_SERVER_ERROR)
  }
}
