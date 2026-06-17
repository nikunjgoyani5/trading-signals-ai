import mongoose from 'mongoose'
import { Blog, type IBlog } from '../models/blog.model.js'

/** Decode path/query identifier (handles %20 spaces from Postman/browser). */
export function decodeBlogIdentifier(raw: string): string {
  const trimmed = raw.trim()
  try {
    return decodeURIComponent(trimmed)
  } catch {
    return trimmed
  }
}

/** Same slug rules as createBlog — lets titles in the URL match stored slugs. */
export function titleToSlug(value: string): string {
  let slug = value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')

  if (!slug) {
    slug = `post-${Math.random().toString(36).substring(2, 7)}`
  }

  return slug
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Find blog by MongoDB id, slug, or title (Next.js-style + title support).
 * Lookup order: id → slug → slug-from-title → exact title → case-insensitive title.
 */
export async function findBlogByIdentifier(raw: string): Promise<IBlog | null> {
  const identifier = decodeBlogIdentifier(raw)

  if (!identifier) return null

  if (mongoose.Types.ObjectId.isValid(identifier)) {
    const byId = await Blog.findById(identifier)
    if (byId) return byId
  }

  const bySlug = await Blog.findOne({ slug: identifier })
  if (bySlug) return bySlug

  const slugFromTitle = titleToSlug(identifier)
  if (slugFromTitle !== identifier) {
    const byGeneratedSlug = await Blog.findOne({ slug: slugFromTitle })
    if (byGeneratedSlug) return byGeneratedSlug
  }

  const byTitle = await Blog.findOne({ title: identifier })
  if (byTitle) return byTitle

  const byTitleInsensitive = await Blog.findOne({
    title: { $regex: new RegExp(`^${escapeRegex(identifier)}$`, 'i') },
  })
  if (byTitleInsensitive) return byTitleInsensitive

  return null
}
