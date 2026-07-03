import { MessageSquare } from 'lucide-react'

export default function InquiryEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-tsai-card/20 px-6 py-16 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
        <MessageSquare className="h-7 w-7 text-tsai-accent-cyan" strokeWidth={1.75} />
      </span>
      <h3 className="mt-4 text-lg font-semibold text-tsai-text">No enquiries yet</h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-tsai-subtle">
        Contact form submissions from the landing page will appear here once visitors submit the
        form and email delivery succeeds.
      </p>
    </div>
  )
}
