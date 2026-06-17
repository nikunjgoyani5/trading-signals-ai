import { createApi } from '@reduxjs/toolkit/query/react'
import type { DashboardAnalytics } from '../../types/dashboard'
import { baseQueryWithAuth } from './baseQuery'

export const dashboardApi = createApi({
  reducerPath: 'dashboardApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Dashboard'],
  endpoints: (builder) => ({
    getDashboardAnalytics: builder.query<DashboardAnalytics, void>({
      query: () => '/dashboard/analytics',
      providesTags: ['Dashboard'],
    }),
  }),
})

export const { useGetDashboardAnalyticsQuery } = dashboardApi
