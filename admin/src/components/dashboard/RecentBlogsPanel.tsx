import { Link } from 'react-router-dom'
import BlogStatusBadge from '../blogs/BlogStatusBadge'
import { resolveBlogCoverUrl } from '../../utils/mapBlog'
import { getPublicBlogUrl } from '../../utils/blogUrls'
import type { DashboardRecentBlog } from '../../types/dashboard'
import { formatRelativeTime } from '../../utils/formatRelativeTime'

type RecentBlogsPanelProps = {
  blogs: DashboardRecentBlog[]
}

export default function RecentBlogsPanel({ blogs }: RecentBlogsPanelProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#00000033] backdrop-blur-md ">
      <div className="flex items-center justify-between border-b border-white/8 px-4 py-3 sm:px-5">
        <div>
          <h3 className="text-sm font-semibold text-tsai-text">Recent Blog Posts</h3>
          <p className="text-[11px] text-tsai-subtle">{blogs.length} latest from your library</p>
        </div>
        <Link
          to="/admin/blogs"
          className="text-xs font-medium text-tsai-accent-cyan transition hover:underline"
        >
          View all
        </Link>
      </div>

      {blogs.length === 0 ? (
        <p className="px-5 py-6 text-sm text-tsai-muted">No blog posts yet. Create your first post.</p>
      ) : (
        <div className="divide-y divide-white/6">
          {blogs.map((blog) => {
            const coverUrl = resolveBlogCoverUrl(blog.coverImage)
            const viewUrl = getPublicBlogUrl(blog.slug)

            return (
              <div
                key={blog.id}
                className="flex items-center justify-between gap-3 px-4 py-2.5 transition hover:bg-white/[0.02] sm:px-5"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="h-9 w-12 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-tsai-surface">
                    {coverUrl ? (
                      <img src={coverUrl} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-tsai-subtle">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="mb-1">
                      <BlogStatusBadge status={blog.status} />
                    </div>
                    <p className="truncate font-medium text-tsai-text">{blog.title}</p>
                    <p className="truncate font-mono text-[11px] text-tsai-subtle">/{blog.slug}</p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-3 text-right">
                  <span className="hidden text-xs text-tsai-subtle sm:inline">
                    {formatRelativeTime(blog.updatedAt)}
                  </span>
                  {blog.status === 'published' ? (
                    <a
                      href={viewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-tsai-accent-cyan transition hover:border-tsai-accent-cyan/40"
                    >
                      View
                    </a>
                  ) : null}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
