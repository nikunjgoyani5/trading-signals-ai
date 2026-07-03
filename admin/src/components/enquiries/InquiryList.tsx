import type { Inquiry } from '../../types/inquiry'
import {
  formatInquiryDate,
  getInquiryInitials,
  getInquiryName,
  getMessagePreview,
} from '../../utils/inquiryUtils'
import InquiryStatusBadge from './InquiryStatusBadge'
import InquiryTicketBadge from './InquiryTicketBadge'

type InquiryListProps = {
  inquiries: Inquiry[]
  selectedId: string | null
  onSelect: (id: string) => void
}

export default function InquiryList({ inquiries, selectedId, onSelect }: InquiryListProps) {
  if (inquiries.length === 0) return null

  return (
    <ul className="space-y-2.5 p-3 sm:p-4">
      {inquiries.map((inquiry) => {
        const isSelected = inquiry.id === selectedId
        const name = getInquiryName(inquiry)

        return (
          <li key={inquiry.id}>
            <button
              type="button"
              onClick={() => onSelect(inquiry.id)}
              className={`group relative flex w-full cursor-pointer gap-0 overflow-hidden rounded-2xl border text-left transition hover:-translate-y-px ${
                isSelected
                  ? 'border-tsai-accent-cyan/35 bg-linear-to-br from-tsai-accent-cyan/10 via-white/3 to-transparent shadow-[0_0_20px_rgba(18,215,245,0.1)]'
                  : 'border-white/8 bg-linear-to-br from-white/3 to-transparent hover:border-white/14 hover:shadow-[0_8px_24px_rgba(0,0,0,0.22)]'
              }`}
            >
              <div
                className={`w-1 shrink-0 self-stretch ${
                  isSelected ? 'bg-tsai-accent-cyan' : 'bg-sky-500/40 group-hover:bg-sky-400/70'
                }`}
                aria-hidden
              />

              <div className="min-w-0 flex-1 px-3.5 py-3.5 sm:px-4">
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-semibold ring-1 ${
                      isSelected
                        ? 'bg-tsai-accent-cyan/15 text-tsai-accent-cyan ring-tsai-accent-cyan/30'
                        : 'bg-white/6 text-tsai-muted ring-white/8 group-hover:bg-white/8 group-hover:text-tsai-text'
                    }`}
                  >
                    {getInquiryInitials(name)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="truncate text-sm font-semibold text-tsai-text">{name}</p>
                      <span className="shrink-0 text-xs font-medium text-tsai-subtle">
                        {formatInquiryDate(inquiry.createdAt)}
                      </span>
                    </div>
                    <p className="mt-0.5 truncate text-xs text-tsai-muted">{inquiry.email}</p>
                    <p className="mt-2 line-clamp-1 text-xs leading-relaxed text-tsai-subtle">
                      {getMessagePreview(inquiry.message)}
                    </p>
                    <div className="mt-2.5 flex flex-wrap items-center gap-2">
                      <InquiryTicketBadge ticketNumber={inquiry.ticketNumber} />
                      <InquiryStatusBadge status={inquiry.status} />
                    </div>
                  </div>
                </div>
              </div>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
