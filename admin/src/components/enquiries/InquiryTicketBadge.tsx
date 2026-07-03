type InquiryTicketBadgeProps = {
  ticketNumber: string
}

export default function InquiryTicketBadge({ ticketNumber }: InquiryTicketBadgeProps) {
  return (
    <span className="inline-flex shrink-0 rounded-lg border border-tsai-accent-cyan/20 bg-tsai-accent-cyan/10 px-2 py-0.5 font-mono text-[10px] font-medium text-tsai-accent-cyan sm:text-[11px]">
      {ticketNumber}
    </span>
  )
}
