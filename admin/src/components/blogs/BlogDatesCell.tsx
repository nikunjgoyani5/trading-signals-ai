import { splitFormattedDate } from './blogDateUtils'

type BlogDatesCellProps = {
  createdAt: string
  updatedAt: string
}

function DateBlock({ label, value }: { label: string; value: string }) {
  const { date, time } = splitFormattedDate(value)

  return (
    <div>
      <p className="mb-0.5 text-[10px] font-semibold tracking-wider text-tsai-subtle uppercase">
        {label}
      </p>
      <p className="text-xs leading-tight text-tsai-text/90">{date}</p>
      {time ? <p className="mt-0.5 text-[10px] leading-tight text-tsai-subtle">{time}</p> : null}
    </div>
  )
}

/** Combined created + updated for narrower table layouts */
export default function BlogDatesCell({ createdAt, updatedAt }: BlogDatesCellProps) {
  return (
    <div className="flex flex-col gap-2 py-0.5">
      <DateBlock label="Created" value={createdAt} />
      <DateBlock label="Updated" value={updatedAt} />
    </div>
  )
}
