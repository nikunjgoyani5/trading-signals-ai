import type { ApiBlogDocument, Blog, BlogStatus } from '../types/blog'

export function resolveBlogCoverUrl(coverImage?: string): string | undefined {
  const value = coverImage?.trim()
  if (!value) return undefined
  if (/^https?:\/\//i.test(value)) return value
  if (value.startsWith('//')) return `https:${value}`
  if (value.startsWith('/')) return value
  return `/${value}`
}

function formatDate(value?: string): string {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function normalizeStatus(value?: string): BlogStatus {
  if (value === 'published' || value === 'archived') return value
  return 'draft'
}

export function mapApiBlogToBlog(raw: ApiBlogDocument): Blog {
  const id = String(raw._id ?? raw.id ?? '')
  const title = raw.title?.trim() || 'Untitled'
  const slug =
    raw.slug?.trim() ||
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

  return {
    id,
    title,
    slug,
    content: raw.content?.trim() ?? '',
    coverImage: raw.coverImage?.trim() ?? '',
    status: normalizeStatus(raw.status),
    publishedAt: formatDate(raw.publishedAt),
    archivedAt: formatDate(raw.archivedAt),
    createdAt: formatDate(raw.createdAt),
    updatedAt: formatDate(raw.updatedAt),
  }
}

export function mapBlogsListResponse(response: {
  blogs: ApiBlogDocument[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}) {
  return {
    blogs: response.blogs.map(mapApiBlogToBlog),
    total: response.total,
    page: response.page,
    limit: response.limit,
    hasMore: response.hasMore,
  }
}
