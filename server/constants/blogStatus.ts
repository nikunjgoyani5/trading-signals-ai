export const BLOG_STATUSES = ['draft', 'published', 'archived'] as const

export type BlogStatus = (typeof BLOG_STATUSES)[number]

export const BLOG_STATUS_FILTER_VALUES = ['all', ...BLOG_STATUSES] as const

export type BlogStatusFilter = (typeof BLOG_STATUS_FILTER_VALUES)[number]

export function isBlogStatus(value: string): value is BlogStatus {
  return (BLOG_STATUSES as readonly string[]).includes(value)
}

export function isBlogStatusFilter(value: string): value is BlogStatusFilter {
  return (BLOG_STATUS_FILTER_VALUES as readonly string[]).includes(value)
}
