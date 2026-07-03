import { CheckCircle2, Inbox, Mail, MessageCircle } from 'lucide-react'

type InquiryStatsCardsProps = {
  total: number
  open: number
  responded: number
  resolved: number
}

const cards = [
  { key: 'total', label: 'Total Inquiries', icon: Inbox, color: 'text-tsai-accent-cyan' },
  { key: 'open', label: 'Open', icon: MessageCircle, color: 'text-amber-300' },
  { key: 'responded', label: 'Responded', icon: Mail, color: 'text-sky-300' },
  { key: 'resolved', label: 'Resolved', icon: CheckCircle2, color: 'text-emerald-400' },
] as const

export default function InquiryStatsCards({
  total,
  open,
  responded,
  resolved,
}: InquiryStatsCardsProps) {
  const values = { total, open, responded, resolved }

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <div
            key={card.key}
            className="rounded-2xl border border-white/8 bg-linear-to-br from-tsai-card/60 to-transparent p-4"
          >
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/8 bg-white/5">
                <Icon className={`h-4 w-4 ${card.color}`} strokeWidth={2} />
              </span>
              <p className="text-xs font-medium text-tsai-subtle">{card.label}</p>
            </div>
            <p className="mt-3 text-2xl font-semibold tracking-tight text-tsai-text">
              {values[card.key]}
            </p>
          </div>
        )
      })}
    </div>
  )
}
