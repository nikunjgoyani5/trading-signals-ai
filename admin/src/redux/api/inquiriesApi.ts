import { createApi } from '@reduxjs/toolkit/query/react'
import type { InquiriesListResult, Inquiry, InquiryStatus } from '../../types/inquiry'
import { baseQueryWithAuth } from './baseQuery'

export const inquiriesApi = createApi({
  reducerPath: 'inquiriesApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Inquiries'],
  endpoints: (builder) => ({
    getInquiries: builder.query<InquiriesListResult, void>({
      query: () => '/inquiries',
      providesTags: [{ type: 'Inquiries', id: 'LIST' }],
    }),
    updateInquiryStatus: builder.mutation<
      Inquiry,
      { identifier: string; status: InquiryStatus }
    >({
      query: ({ identifier, status }) => ({
        url: `/inquiries/${encodeURIComponent(identifier)}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: [{ type: 'Inquiries', id: 'LIST' }],
    }),
  }),
})

export const { useGetInquiriesQuery, useUpdateInquiryStatusMutation } = inquiriesApi
