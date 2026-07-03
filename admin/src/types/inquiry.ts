export type InquiryStatus = 'open' | 'responded' | 'resolved'

export type Inquiry = {
  id: string
  ticketNumber: string
  firstName: string
  lastName: string
  email: string
  phone: string
  message: string
  status: InquiryStatus
  respondedAt: string | null
  resolvedAt: string | null
  createdAt: string
  updatedAt: string
}

export type InquiryDateFilter = 'all' | 'today' | 'week'
export type InquiryStatusFilter = 'all' | InquiryStatus

export type InquiriesListResult = {
  count: number
  inquiries: Inquiry[]
}
