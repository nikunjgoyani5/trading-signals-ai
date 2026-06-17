import StatCard from '../dashboard/StatCard'
import type { DashboardAnalytics } from '../../types/dashboard'

type BlogAnalyticsSummaryProps = {
  overview: DashboardAnalytics['overview']
}

export default function BlogAnalyticsSummary({ overview }: BlogAnalyticsSummaryProps) {
  const { statusCounts } = overview

  const monthChangeLabel =
    overview.monthOverMonthChange === null
      ? overview.blogsThisMonth > 0
        ? 'First posts this month'
        : 'No posts this month'
      : `${overview.monthOverMonthChange >= 0 ? '+' : ''}${overview.monthOverMonthChange}% vs last month`

  const monthTrend: 'up' | 'down' | 'neutral' =
    overview.monthOverMonthChange === null
      ? 'neutral'
      : overview.monthOverMonthChange >= 0
        ? 'up'
        : 'down'

  const stats = [
    {
      label: 'Total Posts',
      value: overview.totalBlogs.toLocaleString(),
      change: `${overview.postsUpdatedLast7Days} updated in last 7 days`,
      trend: 'neutral' as const,
      accent: 'cyan' as const,
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
          />
        </svg>
      ),
    },
    {
      label: 'Published',
      value: statusCounts.published.toLocaleString(),
      change: `${overview.blogsThisWeek} this week · ${monthChangeLabel}`,
      trend: monthTrend,
      accent: 'emerald' as const,
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: 'Drafts',
      value: statusCounts.draft.toLocaleString(),
      change: `${overview.blogsThisMonth} published this month`,
      trend: 'neutral' as const,
      accent: 'blue' as const,
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
          />
        </svg>
      ),
    },
    {
      label: 'Archived',
      value: statusCounts.archived.toLocaleString(),
      change: `${overview.coverImageRate}% of published have covers`,
      trend: overview.coverImageRate >= 70 ? ('up' as const) : ('neutral' as const),
      accent: 'violet' as const,
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
          />
        </svg>
      ),
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  )
}

function AnalyticsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="h-[7.5rem] animate-pulse rounded-2xl border border-white/10 bg-white/5 sm:h-[8.5rem]"
        />
      ))}
    </div>
  )
}

BlogAnalyticsSummary.Skeleton = AnalyticsSkeleton
