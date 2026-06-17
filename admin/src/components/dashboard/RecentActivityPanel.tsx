import type { DashboardActivityItem } from '../../types/dashboard'
import { formatRelativeTime } from '../../utils/formatRelativeTime'

type RecentActivityPanelProps = {
  activity: DashboardActivityItem[]
}

export default function RecentActivityPanel({ activity }: RecentActivityPanelProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#00000033] p-4 backdrop-blur-md">
      <h3 className="text-sm font-semibold text-tsai-text">Recent Activity</h3>

      {activity.length === 0 ? (
        <p className="mt-3 text-xs text-tsai-muted">No content activity yet.</p>
      ) : (
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {activity.slice(0, 6).map((item) => (
            <li
              key={item.id}
              className="flex gap-2.5 rounded-lg border border-white/8 bg-white/[0.03] px-3 py-2.5"
            >
              <span
                className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-tsai-accent-cyan"
                aria-hidden
              />
              <div className="min-w-0">
                <p className="text-[11px] text-tsai-subtle">{formatRelativeTime(item.timestamp)}</p>
                <p className="mt-0.5 truncate text-xs text-tsai-muted">
                  {item.type === 'created' ? 'Created' : 'Updated'}{' '}
                  <span className="text-tsai-text">{item.title}</span>
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
