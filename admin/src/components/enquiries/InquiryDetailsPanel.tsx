import { Calendar, Mail, MessageSquare, Phone, X } from 'lucide-react'
import type { ReactNode } from 'react'
import type { Inquiry, InquiryStatus } from '../../types/inquiry'
import {
  formatInquiryDateTime,
  getInquiryInitials,
  getInquiryName,
} from '../../utils/inquiryUtils'
import InquiryStatusActions from './InquiryStatusActions'
import InquiryStatusBadge from './InquiryStatusBadge'
import InquiryTicketBadge from './InquiryTicketBadge'

type InquiryDetailsPanelProps = {
  inquiry: Inquiry
  onClose?: () => void
  showClose?: boolean
  updatingStatus?: boolean
  onStatusChange?: (status: InquiryStatus) => void
}

function DetailTile({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof Mail
  label: string
  children: ReactNode
}) {
  return (
    <div className="min-w-0 rounded-xl border border-white/8 bg-linear-to-br from-white/4 to-transparent p-3.5">
      <div className="flex items-center gap-2 text-tsai-subtle">
        <Icon className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
        <span className="text-xs font-semibold tracking-wider uppercase">{label}</span>
      </div>
      <div className="mt-2 text-sm leading-snug text-tsai-text">{children}</div>
    </div>
  )
}

export default function InquiryDetailsPanel({
  inquiry,
  onClose,
  showClose = false,
  updatingStatus = false,
  onStatusChange,
}: InquiryDetailsPanelProps) {
  const name = getInquiryName(inquiry)
  const { date, time } = formatInquiryDateTime(inquiry.createdAt)

  return (
    <div className="flex h-full flex-col bg-linear-to-b from-white/2 to-transparent">
      {showClose && onClose ? (
        <div className="flex shrink-0 items-center justify-between border-b border-white/8 px-4 py-3 lg:hidden">
          <h3 className="font-semibold text-tsai-text">Enquiry details</h3>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-lg p-2 text-tsai-muted hover:bg-white/5 hover:text-tsai-text"
            aria-label="Close details"
          >
            <X className="h-5 w-5" strokeWidth={2} />
          </button>
        </div>
      ) : null}

      <div className="shrink-0 border-b border-tsai-accent-cyan/10 bg-linear-to-br from-tsai-accent-cyan/8 via-transparent to-transparent px-5 py-5 sm:px-6">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-tsai-accent-cyan/15 text-lg font-bold text-tsai-accent-cyan ring-1 ring-tsai-accent-cyan/25">
            {getInquiryInitials(name)}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-bold tracking-tight text-tsai-text sm:text-2xl">{name}</h2>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <InquiryTicketBadge ticketNumber={inquiry.ticketNumber} />
              <InquiryStatusBadge status={inquiry.status} />
            </div>
          </div>
        </div>
      </div>

      <div className="shrink-0 px-5 py-4 sm:px-6">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <DetailTile icon={Mail} label="Email">
            <a
              href={`mailto:${inquiry.email}`}
              className="block cursor-pointer break-all text-tsai-accent-cyan no-underline transition-colors hover:underline"
            >
              {inquiry.email}
            </a>
          </DetailTile>

          <DetailTile icon={Phone} label="Phone">
            {inquiry.phone ? (
              <a
                href={`tel:${inquiry.phone.replace(/\s/g, '')}`}
                className="block cursor-pointer break-all no-underline transition-colors hover:text-white"
              >
                {inquiry.phone}
              </a>
            ) : (
              <span className="text-tsai-subtle">Not provided</span>
            )}
          </DetailTile>

          <DetailTile icon={Calendar} label="Submitted">
            <p>{date}</p>
            <p className="mt-0.5 text-xs text-tsai-subtle">{time}</p>
          </DetailTile>
        </div>
      </div>

      <section className="flex min-h-0 flex-1 flex-col px-5 pb-4 sm:px-6">
        <div className="mb-3 flex shrink-0 items-center gap-2">
          <MessageSquare className="h-4 w-4 text-tsai-subtle" strokeWidth={1.75} />
          <h4 className="text-xs font-semibold tracking-wider text-tsai-subtle uppercase">
            Message
          </h4>
        </div>
        <div className="min-h-32 flex-1 overflow-y-auto rounded-2xl border border-white/8 bg-linear-to-br from-white/5 via-white/2 to-transparent p-5 shadow-[inset_0_1px_0_rgb(255_255_255/0.04)]">
          <p className="text-sm leading-relaxed whitespace-pre-wrap text-tsai-muted">
            {inquiry.message}
          </p>
        </div>
      </section>

      <div className="shrink-0 border-t border-white/8 bg-black/20 p-4 sm:px-6">
        {onStatusChange ? (
          <div className="mb-4">
            <p className="mb-2 text-xs font-semibold tracking-wider text-tsai-subtle uppercase">
              Ticket status
            </p>
            <InquiryStatusActions
              status={inquiry.status}
              updating={updatingStatus}
              onStatusChange={onStatusChange}
            />
          </div>
        ) : null}

        <a
          href={`mailto:${inquiry.email}?subject=Re: ${encodeURIComponent(inquiry.ticketNumber)}`}
          className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-linear-to-r from-tsai-accent to-tsai-accent-cyan px-4 py-2.5 text-sm font-semibold text-white no-underline transition hover:opacity-90 sm:w-auto"
        >
          <Mail className="h-4 w-4" strokeWidth={2} />
          Reply via Email
        </a>
      </div>
    </div>
  )
}
