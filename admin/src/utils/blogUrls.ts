const BLOG_PUBLIC_URL =
  import.meta.env.VITE_BLOG_PUBLIC_URL ?? 'https://www.tradingsignals.ai'

function trimBase(url: string) {
  return url.replace(/\/$/, '')
}

/** Public blog detail page — /blogs/:slug */
export function getPublicBlogUrl(slug: string) {
  return `${trimBase(BLOG_PUBLIC_URL)}/blogs/${encodeURIComponent(slug)}`
}

/** Admin edit page */
export function getAdminEditBlogUrl(blogId: string) {
  return `/admin/blogs/edit/${encodeURIComponent(blogId)}`
}
