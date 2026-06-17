import type { DashboardAnalytics } from '../../types/dashboard'

type ContentHealthCardProps = {
  health: DashboardAnalytics['contentHealth']
}

function scoreColor(score: number): string {
  if (score >= 80) return 'text-emerald-400'
  if (score >= 60) return 'text-tsai-accent-cyan'
  if (score >= 40) return 'text-amber-300'
  return 'text-red-300'
}

export default function ContentHealthCard({ health }: ContentHealthCardProps) {
  const primaryTip = health.tips[0]

  return (
    <div className="rounded-2xl border border-white/10 bg-[#00000033] p-4 backdrop-blur-md">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-tsai-text">Content Health</h3>
          <p className="text-[11px] text-tsai-subtle">{health.label}</p>
        </div>
        <p className={`text-xl font-bold tabular-nums ${scoreColor(health.score)}`}>
          {health.score}
        </p>
      </div>

      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-linear-to-r from-tsai-accent to-tsai-accent-cyan transition-all duration-500"
          style={{ width: `${health.score}%` }}
        />
      </div>

      {primaryTip ? (
        <p className="mt-3 text-xs leading-relaxed text-tsai-muted">{primaryTip}</p>
      ) : null}
    </div>
  )
}
