type StatCardProps = {
  label: string
  value: string
  change?: string
  trend?: 'up' | 'down' | 'neutral'
  icon: React.ReactNode
  accent?: 'cyan' | 'blue' | 'violet' | 'emerald'
}

const accentGlow = {
  cyan: 'from-tsai-accent-cyan/20 via-transparent to-transparent shadow-[0_0_40px_rgba(18,215,245,0.12)]',
  blue: 'from-tsai-accent/25 via-transparent to-transparent shadow-[0_0_40px_rgba(18,61,255,0.15)]',
  violet: 'from-violet-500/20 via-transparent to-transparent',
  emerald: 'from-emerald-500/15 via-transparent to-transparent',
}

const trendColor = {
  up: 'text-emerald-400',
  down: 'text-red-400',
  neutral: 'text-tsai-subtle',
}

export default function StatCard({
  label,
  value,
  change,
  trend = 'neutral',
  icon,
  accent = 'cyan',
}: StatCardProps) {
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#00000033] p-4 backdrop-blur-md transition duration-300 hover:border-white/15 hover:shadow-[0_20px_60px_rgba(0,18,184,0.15)] sm:p-5">
      <div
        className={`pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full bg-linear-to-br ${accentGlow[accent]}`}
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.04)_0%,transparent_50%)]" />

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium tracking-wider text-tsai-subtle uppercase">{label}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-tsai-text sm:text-3xl">{value}</p>
          {change ? (
            <p className={`mt-1.5 text-xs font-medium sm:text-sm ${trendColor[trend]}`}>{change}</p>
          ) : null}
        </div>
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-linear-to-br from-tsai-card/80 to-tsai-card-dark/80 text-tsai-accent-cyan shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
          {icon}
        </div>
      </div>
    </article>
  )
}
