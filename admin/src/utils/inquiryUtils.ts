import type {
  Inquiry,
  InquiryDateFilter,
  InquiryStatusFilter,
} from '../types/inquiry'

export const INQUIRY_STATUS_LABELS = {
  open: 'Open',
  responded: 'Responded',
  resolved: 'Resolved',
} as const

export function getInquiryName(inquiry: Inquiry): string {
  return `${inquiry.firstName} ${inquiry.lastName}`.trim()
}

export function getInquiryInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export function formatInquiryDate(iso: string): string {
  const date = new Date(iso)
  const now = new Date()
  if (date.toDateString() === now.toDateString()) return 'Today'

  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday'

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function formatInquiryDateTime(iso: string): { date: string; time: string } {
  const date = new Date(iso)
  return {
    date: date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }),
    time: date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }),
  }
}

export function getMessagePreview(message: string, maxLength = 52): string {
  const line = message.split('\n').find((entry) => entry.trim().length > 0) ?? message
  if (line.length <= maxLength) return line
  return `${line.slice(0, maxLength).trim()}...`
}

export function filterInquiries(
  inquiries: Inquiry[],
  query: string,
  dateFilter: InquiryDateFilter,
  statusFilter: InquiryStatusFilter = 'all',
): Inquiry[] {
  const q = query.trim().toLowerCase()
  const now = new Date()
  const todayStr = now.toDateString()
  const weekStart = new Date(now)
  weekStart.setDate(weekStart.getDate() - 7)

  return inquiries.filter((inquiry) => {
    if (statusFilter !== 'all' && inquiry.status !== statusFilter) return false

    const created = new Date(inquiry.createdAt)
    if (dateFilter === 'today' && created.toDateString() !== todayStr) return false
    if (dateFilter === 'week' && created < weekStart) return false

    if (!q) return true

    const haystack =
      `${inquiry.firstName} ${inquiry.lastName} ${inquiry.email} ${inquiry.phone} ${inquiry.message} ${inquiry.ticketNumber}`.toLowerCase()
    return haystack.includes(q)
  })
}

export function computeInquiryStats(inquiries: Inquiry[]) {
  return {
    total: inquiries.length,
    open: inquiries.filter((item) => item.status === 'open').length,
    responded: inquiries.filter((item) => item.status === 'responded').length,
    resolved: inquiries.filter((item) => item.status === 'resolved').length,
  }
}
