import BlogCoverCell from './BlogCoverCell'
import BlogDateCell from './BlogDateCell'
import BlogStatusBadge from './BlogStatusBadge'
import BlogTableActions from './BlogTableActions'
import BlogTitleCell from './BlogTitleCell'
import { splitFormattedDate } from './blogDateUtils'
import type { Blog } from '../../types/blog'

type BlogListCardProps = {
  blog: Blog
}

function formatCompactDate(value: string): string {
  const { date, time } = splitFormattedDate(value)
  return time ? `${date} ${time}` : date
}

export default function BlogListCard({ blog }: BlogListCardProps) {
  return (
    <article className="rounded-xl border border-white/10 bg-tsai-surface/40 p-3.5 transition hover:border-white/15 hover:bg-white/[0.03] sm:p-4">
      <div className="flex items-start gap-3">
        <BlogCoverCell title={blog.title} coverImage={blog.coverImage} size="sm" />
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <BlogStatusBadge status={blog.status} />
          </div>
          <BlogTitleCell title={blog.title} slug={blog.slug} />
          <p className="mt-1.5 text-[10px] leading-relaxed text-tsai-subtle sm:hidden">
            <span className="font-medium text-tsai-muted">Created</span>{' '}
            {formatCompactDate(blog.createdAt)}
            <span className="mx-1.5 text-white/20">·</span>
            <span className="font-medium text-tsai-muted">Updated</span>{' '}
            {formatCompactDate(blog.updatedAt)}
          </p>
        </div>
      </div>

      <div className="mt-2.5 hidden gap-3 border-t border-white/6 pt-2.5 sm:grid sm:grid-cols-2">
        <div>
          <p className="mb-0.5 text-[10px] font-semibold tracking-wider text-tsai-subtle uppercase">
            Created
          </p>
          <BlogDateCell value={blog.createdAt} />
        </div>
        <div>
          <p className="mb-0.5 text-[10px] font-semibold tracking-wider text-tsai-subtle uppercase">
            Updated
          </p>
          <BlogDateCell value={blog.updatedAt} />
        </div>
      </div>

      <div className="mt-3 border-t border-white/8 pt-3">
        <BlogTableActions blog={blog} layout="card" />
      </div>
    </article>
  )
}
