import { Link } from 'react-router-dom'
import ContentHealthCard from '../components/dashboard/ContentHealthCard'
import IntegrationsStatus from '../components/dashboard/IntegrationsStatus'
import PublicationTrendChart from '../components/dashboard/PublicationTrendChart'
import QuickActionsCard from '../components/dashboard/QuickActionsCard'
import RecentActivityPanel from '../components/dashboard/RecentActivityPanel'
import RecentBlogsPanel from '../components/dashboard/RecentBlogsPanel'
import StatCard from '../components/dashboard/StatCard'
import { useAuth } from '../hooks/useAuth'
import { useGetDashboardAnalyticsQuery } from '../redux/api/dashboardApi'
import { getApiErrorMessage } from '../utils/apiError'

function DashboardSkeleton() {
  return (
    <div className="space-y-5 animate-pulse">
      <div className="h-40 rounded-2xl border border-white/10 bg-white/5" />
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-36 rounded-2xl border border-white/10 bg-white/5" />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-3">
        <div className="h-80 rounded-2xl border border-white/10 bg-white/5 xl:col-span-2" />
        <div className="h-80 rounded-2xl border border-white/10 bg-white/5" />
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const { data, isLoading, isError, error, isFetching, refetch } = useGetDashboardAnalyticsQuery()
  const firstName = user?.name?.split(' ')[0] ?? 'Admin'

  if (isLoading) {
    return <DashboardSkeleton />
  }

  if (isError || !data) {
    return (
      <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-6 py-10 text-center">
        <p className="font-medium text-red-200">Failed to load dashboard analytics</p>
        <p className="mt-2 text-sm text-red-200/80">{getApiErrorMessage(error)}</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="mt-4 cursor-pointer rounded-lg bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/15"
        >
          Try again
        </button>
      </div>
    )
  }

  const { overview, contentHealth, publicationTrend, recentBlogs, recentActivity, integrations } =
    data

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
      label: 'Published Posts',
      value: overview.statusCounts.published.toLocaleString(),
      change: `${overview.blogsThisWeek} published this week · ${monthChangeLabel}`,
      trend: monthTrend,
      accent: 'cyan' as const,
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      ),
    },
    {
      label: 'Draft Posts',
      value: overview.statusCounts.draft.toLocaleString(),
      change: `${overview.statusCounts.archived} archived · ${overview.blogsThisMonth} published this month`,
      trend: monthTrend,
      accent: 'blue' as const,
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
        </svg>
      ),
    },
    {
      label: 'Cover Image Rate',
      value: `${overview.coverImageRate}%`,
      change: `${overview.blogsWithCover} of ${overview.statusCounts.published} published have covers`,
      trend: overview.coverImageRate >= 70 ? ('up' as const) : ('neutral' as const),
      accent: 'violet' as const,
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
        </svg>
      ),
    },
    {
      label: 'Avg Words / Post',
      value: overview.avgWordsPerPost.toLocaleString(),
      change: `${overview.postsUpdatedLast7Days} posts updated in 7 days`,
      trend: 'neutral' as const,
      accent: 'emerald' as const,
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
        </svg>
      ),
    },
  ]

  const allIntegrationsActive =
    integrations.dbConnected &&
    integrations.cloudinaryConfigured &&
    integrations.openAiConfigured &&
    integrations.brevoConfigured

  return (
    <div className="space-y-5">
      <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#00000033] p-5 backdrop-blur-md sm:p-6">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(0,240,255,0.12)_0%,transparent_55%)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute top-0 right-0 h-full w-1/2 bg-[radial-gradient(ellipse_at_80%_30%,rgba(18,61,255,0.2)_0%,transparent_60%)]"
          aria-hidden
        />
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-medium tracking-[0.2em] text-tsai-accent-cyan uppercase">
              Admin Control Center
            </p>
            <h2 className="mt-1.5 text-2xl font-bold tracking-tight text-tsai-text sm:text-3xl">
              Welcome back, {firstName}
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-tsai-muted">
              {overview.statusCounts.published} published, {overview.statusCounts.draft} drafts,{' '}
              {overview.statusCounts.archived} archived - {contentHealth.score}/100 content health.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-white/10 disabled:opacity-50"
            >
              {isFetching ? 'Refreshing…' : 'Refresh data'}
            </button>
            <Link
              to="/admin/blogs"
              className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-tsai-accent to-tsai-accent-cyan px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_28px_rgba(18,215,245,0.35)] transition hover:opacity-90"
            >
              Manage Blogs
            </Link>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-end justify-between">
          <div>
            <h3 className="text-lg font-semibold text-tsai-text">Content Analytics</h3>
            <p className="text-sm text-tsai-subtle">Live metrics from your blog database</p>
          </div>
          <span
            className={`hidden rounded-full border px-3 py-1 text-xs font-medium sm:inline ${
              allIntegrationsActive
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                : 'border-amber-500/30 bg-amber-500/10 text-amber-300'
            }`}
          >
            {allIntegrationsActive ? 'All integrations active' : 'Some integrations need setup'}
          </span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>
      </section>

      <PublicationTrendChart data={publicationTrend} />

      <div className="grid items-start gap-4 lg:grid-cols-12">
        <section className="lg:col-span-7 xl:col-span-8">
          <RecentBlogsPanel blogs={recentBlogs} />
        </section>

        <section className="grid gap-3 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1 xl:col-span-4">
          <ContentHealthCard health={contentHealth} />
          <QuickActionsCard />
          <IntegrationsStatus integrations={integrations} />
        </section>
      </div>

      <RecentActivityPanel activity={recentActivity} />
    </div>
  )
}
