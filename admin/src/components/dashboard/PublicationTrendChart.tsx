import type { PublicationTrendPoint } from '../../types/dashboard'

type PublicationTrendChartProps = {
  data: PublicationTrendPoint[]
}

const CHART_HEIGHT_PX = 148
const MIN_BAR_PX = 6

function shortMonth(label: string): string {
  return label.split(' ')[0] ?? label
}

export default function PublicationTrendChart({ data }: PublicationTrendChartProps) {
  const total = data.reduce((sum, point) => sum + point.count, 0)
  const maxCount = Math.max(...data.map((point) => point.count), 1)
  const peak = data.reduce(
    (best, point) => (point.count > best.count ? point : best),
    data[0] ?? { month: '', label: '', count: 0 },
  )
  const activeMonths = data.filter((point) => point.count > 0).length
  const avgPerMonth = data.length > 0 ? (total / data.length).toFixed(1) : '0'

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#00000033] backdrop-blur-md">
      <div className="flex flex-col gap-3 border-b border-white/8 px-4 py-4 sm:flex-row sm:items-end sm:justify-between sm:px-5">
        <div>
          <p className="text-xs font-medium tracking-[0.16em] text-tsai-accent-cyan uppercase">
            Content velocity
          </p>
          <h3 className="mt-1 font-semibold text-tsai-text">Publication Trend</h3>
          <p className="mt-1 text-xs text-tsai-subtle">New blog posts over the last 6 months</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-tsai-muted">
            {total} total
          </span>
          <span className="rounded-full border border-tsai-accent-cyan/25 bg-tsai-accent-cyan/10 px-3 py-1 text-xs text-tsai-accent-cyan">
            {avgPerMonth} avg / month
          </span>
          {peak.count > 0 ? (
            <span className="rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400">
              Peak : {shortMonth(peak.label)} ({peak.count})
            </span>
          ) : null}
        </div>
      </div>

      <div className="px-4 py-4 sm:px-5">
        <div className="relative">
          {/* Grid lines */}
          <div
            className="pointer-events-none absolute inset-x-0 top-6 flex flex-col justify-between"
            style={{ height: CHART_HEIGHT_PX }}
            aria-hidden
          >
            {[0, 1, 2, 3].map((line) => (
              <div
                key={line}
                className="border-t border-dashed border-white/[0.06]"
                style={{ marginTop: line === 0 ? 0 : undefined }}
              />
            ))}
          </div>

          <div className="relative flex items-end gap-2 sm:gap-4">
            {data.map((point) => {
              const isPeak = point.count > 0 && point.month === peak.month
              const barHeight =
                point.count === 0
                  ? MIN_BAR_PX
                  : Math.max(MIN_BAR_PX + 8, Math.round((point.count / maxCount) * CHART_HEIGHT_PX))

              return (
                <div
                  key={point.month}
                  className="group flex min-w-0 flex-1 flex-col items-center"
                >
                  <span
                    className={`mb-2 text-[11px] font-semibold tabular-nums sm:text-xs ${
                      isPeak ? 'text-emerald-400' : point.count > 0 ? 'text-tsai-accent-cyan' : 'text-tsai-subtle'
                    }`}
                  >
                    {point.count}
                  </span>

                  <div
                    className="relative flex w-full items-end justify-center px-0.5 sm:px-1"
                    style={{ height: CHART_HEIGHT_PX }}
                  >
                    {/* Track */}
                    <div className="absolute inset-x-1 bottom-0 top-0 rounded-xl bg-white/[0.02]" />

                    <div
                      className={`relative w-full max-w-[3.25rem] rounded-t-xl transition-all duration-500 ease-out sm:max-w-[4rem] ${
                        point.count === 0
                          ? 'bg-white/[0.06]'
                          : isPeak
                            ? 'bg-linear-to-t from-tsai-accent via-tsai-accent to-tsai-accent-cyan shadow-[0_0_28px_rgba(18,215,245,0.35)]'
                            : 'bg-linear-to-t from-tsai-accent/80 to-tsai-accent-cyan/90 shadow-[0_0_18px_rgba(18,215,245,0.18)]'
                      } group-hover:brightness-110`}
                      style={{ height: barHeight }}
                      title={`${point.label}: ${point.count} posts`}
                    >
                      {point.count > 0 ? (
                        <div className="absolute inset-x-0 top-0 h-1 rounded-t-xl bg-white/25" />
                      ) : null}
                    </div>
                  </div>

                  <div className="mt-3 w-full text-center">
                    <p
                      className={`text-[11px] font-medium sm:text-xs ${
                        isPeak ? 'text-tsai-text' : 'text-tsai-muted'
                      }`}
                    >
                      {shortMonth(point.label)}
                    </p>
                    {isPeak ? (
                      <p className="mt-0.5 text-[10px] text-emerald-400">Best</p>
                    ) : null}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/8 pt-3 text-xs text-tsai-subtle">
          <span>
            {activeMonths === 0
              ? 'No posts published in this window yet'
              : `${activeMonths} active month${activeMonths === 1 ? '' : 's'} with new content`}
          </span>
          <span className="font-mono text-[11px] text-tsai-muted">
            {data[0]?.label} - {data[data.length - 1]?.label}
          </span>
        </div>
      </div>
    </div>
  )
}
