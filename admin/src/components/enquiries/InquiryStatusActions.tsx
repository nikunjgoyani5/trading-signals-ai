import type { InquiryStatus } from '../../types/inquiry'
import { INQUIRY_STATUS_LABELS } from '../../utils/inquiryUtils'

type InquiryStatusActionsProps = {
  status: InquiryStatus
  updating?: boolean
  onStatusChange: (status: InquiryStatus) => void
}

const actions: Array<{
  status: InquiryStatus
  label: string
  className: string
}> = [
  {
    status: 'open',
    label: 'Reopen',
    className:
      'border-amber-500/30 bg-amber-500/10 text-amber-200 hover:border-amber-500/50 hover:bg-amber-500/15',
  },
  {
    status: 'responded',
    label: 'Mark responded',
    className:
      'border-sky-500/30 bg-sky-500/10 text-sky-200 hover:border-sky-500/50 hover:bg-sky-500/15',
  },
  {
    status: 'resolved',
    label: 'Mark resolved',
    className:
      'border-emerald-500/30 bg-emerald-500/10 text-emerald-200 hover:border-emerald-500/50 hover:bg-emerald-500/15',
  },
]

export default function InquiryStatusActions({
  status,
  updating = false,
  onStatusChange,
}: InquiryStatusActionsProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
      {actions.map((action) => {
        const isActive = status === action.status
        return (
          <button
            key={action.status}
            type="button"
            disabled={updating || isActive}
            onClick={() => onStatusChange(action.status)}
            className={`inline-flex cursor-pointer items-center justify-center rounded-xl border px-3.5 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
              isActive ? 'border-white/20 bg-white/10 text-white' : action.className
            }`}
            aria-pressed={isActive}
          >
            {isActive ? INQUIRY_STATUS_LABELS[action.status] : action.label}
          </button>
        )
      })}
    </div>
  )
}
