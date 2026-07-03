import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import InquiryDetailsPanel from '../components/enquiries/InquiryDetailsPanel'
import InquiryEmptyState from '../components/enquiries/InquiryEmptyState'
import InquiryList from '../components/enquiries/InquiryList'
import InquiryStatsCards from '../components/enquiries/InquiryStatsCards'
import InquiryToolbar from '../components/enquiries/InquiryToolbar'
import {
  useGetInquiriesQuery,
  useUpdateInquiryStatusMutation,
} from '../redux/api/inquiriesApi'
import type { InquiryDateFilter, InquiryStatus, InquiryStatusFilter } from '../types/inquiry'
import { computeInquiryStats, filterInquiries } from '../utils/inquiryUtils'
import { getApiErrorMessage } from '../utils/apiError'

const POLL_INTERVAL_MS = 30_000

export default function EnquiriesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const inquiryFromUrl = searchParams.get('inquiry')

  const [search, setSearch] = useState('')
  const [dateFilter, setDateFilter] = useState<InquiryDateFilter>('all')
  const [statusFilter, setStatusFilter] = useState<InquiryStatusFilter>('all')
  const [selectedId, setSelectedId] = useState<string | null>(inquiryFromUrl)
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)

  const { data, isLoading, isFetching, isError, error, refetch } = useGetInquiriesQuery(
    undefined,
    {
      pollingInterval: POLL_INTERVAL_MS,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    },
  )

  const [updateStatus, { isLoading: updatingStatus }] = useUpdateInquiryStatusMutation()

  const inquiries = data?.inquiries ?? []

  useEffect(() => {
    if (!inquiryFromUrl) return
    setSelectedId(inquiryFromUrl)
    if (window.matchMedia('(max-width: 1023px)').matches) {
      setMobileDrawerOpen(true)
    }
  }, [inquiryFromUrl])

  useEffect(() => {
    if (selectedId && inquiries.some((item) => item.id === selectedId)) return
    if (inquiryFromUrl && inquiries.some((item) => item.id === inquiryFromUrl)) {
      setSelectedId(inquiryFromUrl)
      return
    }
    setSelectedId(inquiries[0]?.id ?? null)
  }, [inquiries, selectedId, inquiryFromUrl])

  const filtered = useMemo(
    () => filterInquiries(inquiries, search, dateFilter, statusFilter),
    [inquiries, search, dateFilter, statusFilter],
  )

  const stats = useMemo(() => computeInquiryStats(inquiries), [inquiries])

  const selected = useMemo(() => {
    if (selectedId) {
      const match = inquiries.find((item) => item.id === selectedId)
      if (match) return match
    }
    return filtered[0] ?? null
  }, [inquiries, filtered, selectedId])

  const handleSelect = (id: string) => {
    setSelectedId(id)
    setSearchParams({ inquiry: id }, { replace: true })
    if (window.matchMedia('(max-width: 1023px)').matches) {
      setMobileDrawerOpen(true)
    }
  }

  const handleStatusChange = async (status: InquiryStatus) => {
    if (!selected) return
    try {
      await updateStatus({ identifier: selected.id, status }).unwrap()
    } catch {
      /* RTK shows error via mutation state if needed */
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-5 p-4 sm:p-6 lg:p-8">
      <div>
        <p className="text-xs font-medium tracking-[0.18em] text-tsai-accent-cyan uppercase">
          Support
        </p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight text-tsai-text">Enquiries</h2>
        <p className="mt-1 text-sm text-tsai-subtle">
          Contact form submissions from the landing page — saved to database when submitted.
        </p>
      </div>

      <InquiryStatsCards
        total={stats.total}
        open={stats.open}
        responded={stats.responded}
        resolved={stats.resolved}
      />

      <InquiryToolbar
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        dateFilter={dateFilter}
        onDateFilterChange={setDateFilter}
        onRefresh={() => void refetch()}
        refreshing={isFetching && !isLoading}
        resultCount={filtered.length}
      />

      {isError ? (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {getApiErrorMessage(error)}
        </div>
      ) : null}

      {isLoading ? (
        <div className="grid min-h-[420px] gap-4 lg:grid-cols-[minmax(0,22rem)_1fr]">
          <div className="animate-pulse rounded-2xl border border-white/8 bg-white/5" />
          <div className="animate-pulse rounded-2xl border border-white/8 bg-white/5" />
        </div>
      ) : inquiries.length === 0 ? (
        <InquiryEmptyState />
      ) : (
        <div className="grid min-h-[min(70vh,720px)] gap-4 lg:grid-cols-[minmax(0,22rem)_1fr]">
          <div className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-white/8 bg-tsai-card/30">
            <div className="shrink-0 border-b border-white/8 px-4 py-3">
              <h3 className="text-sm font-semibold text-tsai-text">Inbox</h3>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto">
              {filtered.length === 0 ? (
                <p className="p-6 text-center text-sm text-tsai-subtle">
                  No enquiries match your filters.
                </p>
              ) : (
                <InquiryList
                  inquiries={filtered}
                  selectedId={selected?.id ?? null}
                  onSelect={handleSelect}
                />
              )}
            </div>
          </div>

          <div className="hidden min-h-0 overflow-hidden rounded-2xl border border-white/8 bg-tsai-card/30 lg:block">
            {selected ? (
              <InquiryDetailsPanel
                inquiry={selected}
                updatingStatus={updatingStatus}
                onStatusChange={handleStatusChange}
              />
            ) : (
              <div className="flex h-full items-center justify-center p-8 text-sm text-tsai-subtle">
                Select an enquiry to view details
              </div>
            )}
          </div>
        </div>
      )}

      {mobileDrawerOpen && selected ? (
        <>
          <button
            type="button"
            aria-label="Close enquiry details"
            className="fixed inset-0 z-40 cursor-pointer bg-[#010B24]/75 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileDrawerOpen(false)}
          />
          <aside className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-white/8 bg-tsai-surface shadow-2xl lg:hidden">
            <InquiryDetailsPanel
              inquiry={selected}
              showClose
              onClose={() => setMobileDrawerOpen(false)}
              updatingStatus={updatingStatus}
              onStatusChange={handleStatusChange}
            />
          </aside>
        </>
      ) : null}
    </div>
  )
}
