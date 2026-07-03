import { Mail, MessageSquare, RefreshCw, Search } from 'lucide-react'
import type { InquiryDateFilter, InquiryStatusFilter } from '../../types/inquiry'

type InquiryToolbarProps = {
  search: string
  onSearchChange: (value: string) => void
  statusFilter: InquiryStatusFilter
  onStatusFilterChange: (value: InquiryStatusFilter) => void
  dateFilter: InquiryDateFilter
  onDateFilterChange: (value: InquiryDateFilter) => void
  onRefresh: () => void
  refreshing?: boolean
  resultCount: number
}

const selectClass =
  'cursor-pointer rounded-xl border border-white/10 bg-[#0A1435] px-3 py-2 text-sm text-tsai-text focus:border-tsai-accent-cyan/40 focus:outline-none focus:ring-1 focus:ring-tsai-accent-cyan/20'

export default function InquiryToolbar({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  dateFilter,
  onDateFilterChange,
  onRefresh,
  refreshing = false,
  resultCount,
}: InquiryToolbarProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-white/8 bg-tsai-card/40 p-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
      <div className="relative min-w-0 flex-1 sm:max-w-md">
        <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-tsai-subtle" />
        <input
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search name, email, ticket, message..."
          className="w-full rounded-xl border border-white/10 bg-[#0A1435] py-2.5 pr-3 pl-10 text-sm text-tsai-text placeholder:text-tsai-subtle focus:border-tsai-accent-cyan/40 focus:outline-none focus:ring-1 focus:ring-tsai-accent-cyan/20"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <select
          value={statusFilter}
          onChange={(event) => onStatusFilterChange(event.target.value as InquiryStatusFilter)}
          className={selectClass}
          aria-label="Filter by status"
        >
          <option value="all">All statuses</option>
          <option value="open">Open</option>
          <option value="responded">Responded</option>
          <option value="resolved">Resolved</option>
        </select>

        <select
          value={dateFilter}
          onChange={(event) => onDateFilterChange(event.target.value as InquiryDateFilter)}
          className={selectClass}
          aria-label="Filter by date"
        >
          <option value="all">All time</option>
          <option value="today">Today</option>
          <option value="week">Last 7 days</option>
        </select>

        <button
          type="button"
          onClick={onRefresh}
          disabled={refreshing}
          className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-sm font-medium text-tsai-muted transition hover:border-tsai-accent-cyan/30 hover:bg-white/10 hover:text-tsai-text disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <p className="flex items-center gap-1.5 text-xs text-tsai-subtle sm:w-full lg:w-auto lg:justify-end">
        <MessageSquare className="h-3.5 w-3.5" />
        {resultCount} {resultCount === 1 ? 'inquiry' : 'inquiries'}
        <span className="hidden sm:inline">· notifications to tradingsignals@yopmail.com</span>
        <Mail className="ml-1 hidden h-3.5 w-3.5 sm:inline" aria-hidden />
      </p>
    </div>
  )
}
