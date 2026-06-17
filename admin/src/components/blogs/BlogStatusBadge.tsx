import type { BlogStatus } from '../../types/blog'

const styles: Record<BlogStatus, string> = {
  draft: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
  published: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
  archived: 'border-white/15 bg-white/5 text-tsai-subtle',
}

const labels: Record<BlogStatus, string> = {
  draft: 'Draft',
  published: 'Published',
  archived: 'Archived',
}

type BlogStatusBadgeProps = {
  status: BlogStatus
}

export default function BlogStatusBadge({ status }: BlogStatusBadgeProps) {
  return (
    <span
      className={`inline-flex shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase sm:text-[11px] ${styles[status]}`}
    >
      {labels[status]}
    </span>
  )
}
