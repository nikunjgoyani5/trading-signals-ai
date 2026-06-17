import type { BlogStatus } from '../constants/blogStatus.js'
import { HttpStatus } from '../constants/httpStatus.js'
import type { IBlog } from '../models/blog.model.js'
import { AppError } from './AppError.js'

export function assertPublishable(blog: Pick<IBlog, 'title' | 'content' | 'slug'>): void {
  const errors: string[] = []

  if (!blog.title?.trim()) {
    errors.push('Title is required to publish.')
  }
  if (!blog.content?.trim()) {
    errors.push('Content is required to publish.')
  }
  if (!blog.slug?.trim()) {
    errors.push('Slug is required to publish.')
  }

  if (errors.length > 0) {
    throw new AppError(errors.join(' '), HttpStatus.BAD_REQUEST)
  }
}

export function applyStatusTransition(
  blog: IBlog,
  nextStatus: BlogStatus,
): {
  status: BlogStatus
  publishedAt?: Date
  archivedAt?: Date | null
} | null {
  const current = blog.status ?? 'draft'

  if (current === nextStatus) {
    return null
  }

  if (nextStatus === 'published') {
    if (current !== 'draft' && current !== 'archived') {
      throw new AppError('Only draft or archived posts can be published.', HttpStatus.BAD_REQUEST)
    }
    assertPublishable(blog)
    return {
      status: 'published',
      publishedAt: blog.publishedAt ?? new Date(),
      archivedAt: null,
    }
  }

  if (nextStatus === 'archived') {
    if (current !== 'published') {
      throw new AppError('Only published posts can be archived.', HttpStatus.BAD_REQUEST)
    }
    return {
      status: 'archived',
      archivedAt: new Date(),
    }
  }

  throw new AppError('Invalid blog status transition.', HttpStatus.BAD_REQUEST)
}
