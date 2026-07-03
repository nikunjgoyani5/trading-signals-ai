import type { InquiryStatus } from '../../types/inquiry'
import { INQUIRY_STATUS_LABELS } from '../../utils/inquiryUtils'

const styles: Record<InquiryStatus, string> = {
  open: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
  responded: 'border-sky-500/30 bg-sky-500/10 text-sky-300',
  resolved: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
}

type InquiryStatusBadgeProps = {
  status: InquiryStatus
  className?: string
}

export default function InquiryStatusBadge({ status, className = '' }: InquiryStatusBadgeProps) {
  return (
    <span
      className={`inline-flex shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase sm:text-[11px] ${styles[status]} ${className}`}
    >
      {INQUIRY_STATUS_LABELS[status]}
    </span>
  )
}
