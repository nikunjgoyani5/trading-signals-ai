import type { BlogStatus, BlogsListResult } from '../../types/blog'
import type { DashboardAnalytics } from '../../types/dashboard'
import { dashboardApi } from './dashboardApi'

type BlogsApiQueryState = {
  data?: BlogsListResult
}

type BlogsApiSliceState = {
  queries: Record<string, BlogsApiQueryState | undefined>
}

type DashboardPatch = { undo: () => void }

function findBlogStatusInCache(getState: () => unknown, blogId: string): BlogStatus | undefined {
  const state = getState() as { blogsApi?: BlogsApiSliceState }
  const queries = state.blogsApi?.queries
  if (!queries) return undefined

  for (const entry of Object.values(queries)) {
    const blog = entry?.data?.blogs.find((item) => item.id === blogId)
    if (blog) return blog.status
  }

  return undefined
}

function adjustStatusCount(draft: DashboardAnalytics, status: BlogStatus, delta: number) {
  draft.overview.statusCounts[status] = Math.max(0, draft.overview.statusCounts[status] + delta)
}

function patchStatusTransition(
  draft: DashboardAnalytics,
  previousStatus: BlogStatus,
  nextStatus: BlogStatus | 'deleted',
) {
  if (nextStatus === 'deleted') {
    draft.overview.totalBlogs = Math.max(0, draft.overview.totalBlogs - 1)
    adjustStatusCount(draft, previousStatus, -1)
    return
  }

  if (previousStatus === nextStatus) return

  adjustStatusCount(draft, previousStatus, -1)
  adjustStatusCount(draft, nextStatus, 1)
}

export function optimisticallyPatchDashboardStatus(
  dispatch: (action: unknown) => unknown,
  getState: () => unknown,
  blogId: string,
  nextStatus: BlogStatus | 'deleted',
): DashboardPatch | null {
  const previousStatus = findBlogStatusInCache(getState, blogId)
  if (!previousStatus) return null

  const patch = dispatch(
    dashboardApi.util.updateQueryData('getDashboardAnalytics', undefined, (draft) => {
      patchStatusTransition(draft, previousStatus, nextStatus)
    }),
  ) as DashboardPatch

  return patch
}

export function invalidateDashboardAnalytics(dispatch: (action: unknown) => unknown) {
  dispatch(dashboardApi.util.invalidateTags(['Dashboard']))
}
