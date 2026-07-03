export type BlogStatus = 'draft' | 'published' | 'archived'

export type BlogStatusFilter = 'all' | BlogStatus

/** Raw blog document from admin API GET /api/blogs */
export type ApiBlogDocument = {
  _id?: string
  id?: string
  title?: string
  slug?: string
  content?: string
  coverImage?: string
  aiCoverGenerationCount?: number
  status?: BlogStatus
  publishedAt?: string
  archivedAt?: string
  createdAt?: string
  updatedAt?: string
}

export type BlogsListResponse = {
  blogs: ApiBlogDocument[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

/** Normalized row for the admin table */
export type Blog = {
  id: string
  title: string
  slug: string
  content: string
  coverImage: string
  aiCoverGenerationCount: number
  status: BlogStatus
  publishedAt: string
  archivedAt: string
  createdAt: string
  updatedAt: string
}

export type BlogsListResult = {
  blogs: Blog[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}
