import { useEffect, useMemo, useState } from 'react'
import DataTable, { type TableColumn } from 'react-data-table-component'
import BlogCoverCell from '../components/blogs/BlogCoverCell'
import BlogDateCell from '../components/blogs/BlogDateCell'
import BlogDatesCell from '../components/blogs/BlogDatesCell'
import BlogTitleCell from '../components/blogs/BlogTitleCell'
import BlogListCards from '../components/blogs/BlogListCards'
import BlogStatusBadge from '../components/blogs/BlogStatusBadge'
import BlogAnalyticsSummary from '../components/blogs/BlogAnalyticsSummary'
import BlogStatusFilterBar from '../components/blogs/BlogStatusFilter'
import BlogTableActions from '../components/blogs/BlogTableActions'
import BlogTablePagination from '../components/blogs/BlogTablePagination'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import { useIsLgUp, useIsXlUp } from '../hooks/useMediaQuery'
import { useGetBlogsQuery } from '../redux/api/blogsApi'
import { useGetDashboardAnalyticsQuery } from '../redux/api/dashboardApi'
import { tsaiDataTableStyles, tsaiDataTableTheme } from '../styles/dataTableTheme'
import { getApiErrorMessage } from '../utils/apiError'
import type { Blog, BlogStatusFilter } from '../types/blog'

const SEARCH_DEBOUNCE_MS = 400

function TableSkeleton() {
  return (
    <div className="space-y-3 p-6">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="h-16 animate-pulse rounded-xl border border-white/5 bg-white/5"
        />
      ))}
    </div>
  )
}

export default function AllBlogs() {
  const isLgUp = useIsLgUp()
  const isXlUp = useIsXlUp()
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [searchInput, setSearchInput] = useState('')
  const [statusFilter, setStatusFilter] = useState<BlogStatusFilter>('all')
  const debouncedSearch = useDebouncedValue(searchInput, SEARCH_DEBOUNCE_MS)

  const searchQuery = debouncedSearch.trim()

  useEffect(() => {
    setPage(1)
  }, [searchQuery, statusFilter])

  const { data, isLoading, isFetching, isError, error, refetch } = useGetBlogsQuery({
    page,
    limit: perPage,
    search: searchQuery || undefined,
    status: statusFilter,
  })

  const {
    data: analytics,
    isLoading: isAnalyticsLoading,
    isFetching: isAnalyticsFetching,
    refetch: refetchAnalytics,
  } = useGetDashboardAnalyticsQuery()

  const blogs = data?.blogs ?? []
  const total = data?.total ?? 0
  const isSearchPending = searchInput.trim() !== searchQuery

  const statusCounts = analytics
    ? {
        all: analytics.overview.totalBlogs,
        draft: analytics.overview.statusCounts.draft,
        published: analytics.overview.statusCounts.published,
        archived: analytics.overview.statusCounts.archived,
      }
    : undefined

  const handleRefresh = () => {
    void refetch()
    void refetchAnalytics()
  }

  const columns = useMemo((): TableColumn<Blog>[] => {
    const dateColumns: TableColumn<Blog>[] = isXlUp
      ? [
          {
            name: 'Created',
            selector: (row) => row.createdAt,
            sortable: true,
            width: '116px',
            minWidth: '116px',
            cell: (row) => <BlogDateCell value={row.createdAt} />,
          },
          {
            name: 'Updated',
            selector: (row) => row.updatedAt,
            sortable: true,
            width: '116px',
            minWidth: '116px',
            cell: (row) => <BlogDateCell value={row.updatedAt} />,
          },
        ]
      : [
          {
            name: 'Dates',
            width: '132px',
            minWidth: '132px',
            cell: (row) => (
              <BlogDatesCell createdAt={row.createdAt} updatedAt={row.updatedAt} />
            ),
          },
        ]

    return [
      {
        name: 'Cover',
        width: '88px',
        minWidth: '88px',
        cell: (row) => <BlogCoverCell title={row.title} coverImage={row.coverImage} />,
        ignoreRowClick: true,
      },
      {
        name: 'Title',
        selector: (row) => row.title,
        sortable: true,
        grow: 3,
        minWidth: '180px',
        cell: (row) => (
          <div className="min-w-0 py-0.5">
            <div className="mb-1.5">
              <BlogStatusBadge status={row.status} />
            </div>
            <BlogTitleCell title={row.title} slug={row.slug} />
          </div>
        ),
      },
      ...dateColumns,
      {
        name: '',
        cell: (row) => <BlogTableActions blog={row} />,
        ignoreRowClick: true,
        allowOverflow: true,
        button: true,
        width: '148px',
        minWidth: '148px',
        right: true,
      },
    ]
  }, [isXlUp])

  return (
    <div className="space-y-4 sm:space-y-6">
      <section className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <p className="text-[11px] font-medium tracking-[0.2em] text-tsai-accent-cyan uppercase sm:text-xs">
            Content
          </p>
          <h2 className="mt-1 text-lg font-bold tracking-tight text-tsai-text sm:text-2xl lg:text-3xl">
            All Blogs
          </h2>
          <p className="mt-1.5 hidden text-xs text-tsai-muted sm:mt-2 sm:block sm:text-sm">
            Cover image, title, dates, and quick actions for each post.
          </p>
        </div>
        <div className="flex w-full items-center gap-2 sm:w-auto sm:shrink-0 sm:gap-3">
          <span className="flex-1 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-center text-xs text-tsai-muted sm:flex-none sm:px-4 sm:text-sm">
            {searchQuery ? `${total} matching` : `${total} total posts`}
          </span>
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isFetching || isAnalyticsFetching}
            className="shrink-0 cursor-pointer rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-tsai-muted transition hover:border-tsai-accent-cyan/40 hover:text-tsai-text disabled:opacity-50 sm:px-4 sm:py-2 sm:text-sm"
          >
            {isFetching || isAnalyticsFetching ? '…' : 'Refresh'}
          </button>
        </div>
      </section>

      {isAnalyticsLoading ? (
        <BlogAnalyticsSummary.Skeleton />
      ) : analytics ? (
        <BlogAnalyticsSummary overview={analytics.overview} />
      ) : null}

      {isError ? (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-6 py-8 text-center">
          <p className="font-medium text-red-200">Failed to load blogs</p>
          <p className="mt-2 text-sm text-red-200/80">{getApiErrorMessage(error)}</p>
          <p className="mt-3 text-xs text-tsai-subtle">
            Ensure the admin API is running on{' '}
            <code className="text-tsai-accent-cyan">http://localhost:3000</code>
            {' '}and you are signed in.
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-4 cursor-pointer rounded-lg bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/15"
          >
            Try again
          </button>
        </div>
      ) : null}

      <section className="rounded-2xl border border-white/10 bg-[#00000033] backdrop-blur-md">
        <div className="flex flex-col gap-2.5 border-b border-white/8 p-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:p-5 lg:px-8 lg:py-6">
          <div className="relative min-w-0 flex-1 sm:max-w-md">
            <svg
              className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-tsai-subtle"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
            <input
              type="search"
              placeholder="Search by title or slug…"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-tsai-surface/80 py-2 pr-3 pl-9 text-sm text-tsai-text outline-none transition placeholder:text-tsai-subtle focus:border-tsai-accent-cyan/50 sm:py-2.5 sm:pl-10 sm:pr-4 lg:text-[0.9375rem]"
              aria-busy={isSearchPending || isFetching}
            />
          </div>
          {!isLoading ? (
            <p className="text-[11px] text-tsai-subtle sm:shrink-0 sm:text-xs">
              {isSearchPending
                ? 'Searching…'
                : `Page ${data?.page ?? page} · ${blogs.length} shown${searchQuery ? ` for “${searchQuery}”` : ''}`}
            </p>
          ) : null}
        </div>

        <BlogStatusFilterBar
          value={statusFilter}
          onChange={setStatusFilter}
          counts={statusCounts}
        />

        {isLoading ? (
          <TableSkeleton />
        ) : isLgUp ? (
          <div className="tsai-data-table min-w-0 pb-2 sm:pb-4">
            <DataTable
              columns={columns}
              data={blogs}
              progressPending={isFetching || isSearchPending}
              pagination
              paginationServer
              paginationTotalRows={total}
              paginationDefaultPage={page}
              paginationPerPage={perPage}
              paginationComponent={BlogTablePagination}
              onChangePage={setPage}
              onChangeRowsPerPage={(newPerPage, newPage) => {
                setPerPage(newPerPage)
                setPage(newPage)
              }}
              highlightOnHover={false}
              responsive={false}
              striped={false}
              theme={tsaiDataTableTheme}
              customStyles={tsaiDataTableStyles}
              noDataComponent={
                <p className="py-12 text-sm text-tsai-muted">
                  {searchQuery || statusFilter !== 'all'
                    ? `No blogs match your filters.`
                    : 'No blogs found.'}
                </p>
              }
            />
          </div>
        ) : (
          <div className={isFetching || isSearchPending ? 'opacity-60 transition-opacity' : ''}>
            <BlogListCards
              blogs={blogs}
              total={total}
              page={page}
              perPage={perPage}
              searchQuery={searchQuery}
              onChangePage={setPage}
              onChangePerPage={setPerPage}
            />
          </div>
        )}
      </section>
    </div>
  )
}
