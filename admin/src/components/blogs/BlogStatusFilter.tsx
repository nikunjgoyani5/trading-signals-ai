import type { BlogStatusFilter } from '../../types/blog'

const filters: { value: BlogStatusFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' },
]

export type BlogStatusCounts = {
  all: number
  draft: number
  published: number
  archived: number
}

type BlogStatusFilterBarProps = {
  value: BlogStatusFilter
  onChange: (value: BlogStatusFilter) => void
  counts?: BlogStatusCounts
}

function getFilterCount(value: BlogStatusFilter, counts?: BlogStatusCounts): number | null {
  if (!counts) return null
  return counts[value]
}

export default function BlogStatusFilterBar({ value, onChange, counts }: BlogStatusFilterBarProps) {
  return (
    <div className="flex flex-wrap gap-2 border-b border-white/8 px-3 py-3 sm:px-5">
      {filters.map((filter) => {
        const active = value === filter.value
        const count = getFilterCount(filter.value, counts)
        const label = count === null ? filter.label : `${filter.label} (${count})`

        return (
          <button
            key={filter.value}
            type="button"
            onClick={() => onChange(filter.value)}
            className={`cursor-pointer rounded-full border px-3 py-1.5 text-xs font-medium transition ${
              active
                ? 'border-tsai-accent-cyan/35 bg-tsai-accent-cyan/10 text-tsai-accent-cyan'
                : 'border-white/10 bg-white/5 text-tsai-muted hover:border-white/15 hover:text-tsai-text'
            }`}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
