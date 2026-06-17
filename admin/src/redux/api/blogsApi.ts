import { createApi } from '@reduxjs/toolkit/query/react'
import { getAccessToken } from '../../lib/authStorage'
import type { Blog, BlogStatus, BlogsListResult, BlogStatusFilter } from '../../types/blog'
import { mapApiBlogToBlog, mapBlogsListResponse } from '../../utils/mapBlog'
import { dataUrlToFile } from '../../utils/blogContent'
import { baseQueryWithAuth, getApiBase } from './baseQuery'
import {
  invalidateDashboardAnalytics,
  optimisticallyPatchDashboardStatus,
} from './dashboardCache'

export type UpdateBlogRequest = {
  id: string
  title?: string
  content?: string
  coverImage?: string
  coverImageFile?: File
}

export type CreateBlogRequest = {
  content: string
  status: Extract<BlogStatus, 'draft' | 'published'>
  title?: string
  coverImage?: string
  coverImageFile?: File
}

type ApiWrapper<T> = {
  success: boolean
  message: string
  data?: T
  errors?: Record<string, string[] | undefined>
}

export type GetBlogsParams = {
  page?: number
  limit?: number
  search?: string
  status?: BlogStatusFilter
}

const blogTags = (result?: BlogsListResult) =>
  result
    ? [
        ...result.blogs.map((blog) => ({ type: 'Blogs' as const, id: blog.id })),
        { type: 'Blogs' as const, id: 'LIST' },
      ]
    : [{ type: 'Blogs' as const, id: 'LIST' }]

async function syncDashboardAfterBlogMutation(
  blogId: string,
  nextStatus: 'published' | 'archived' | 'deleted',
  lifecycle: {
    dispatch: (action: unknown) => unknown
    queryFulfilled: Promise<unknown>
    getState: () => unknown
  },
) {
  const patch = optimisticallyPatchDashboardStatus(
    lifecycle.dispatch,
    lifecycle.getState,
    blogId,
    nextStatus,
  )

  try {
    await lifecycle.queryFulfilled
    invalidateDashboardAnalytics(lifecycle.dispatch)
  } catch {
    patch?.undo()
  }
}

export const blogsApi = createApi({
  reducerPath: 'blogsApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Blogs'],
  endpoints: (builder) => ({
    getBlogs: builder.query<BlogsListResult, GetBlogsParams | void>({
      query: (params) => {
        const page = params?.page ?? 1
        const limit = params?.limit ?? 12
        const query = new URLSearchParams({
          page: String(page),
          limit: String(limit),
        })
        const search = params?.search?.trim()
        if (search) {
          query.set('search', search)
        }
        if (params?.status && params.status !== 'all') {
          query.set('status', params.status)
        }
        return `/blogs?${query.toString()}`
      },
      transformResponse: mapBlogsListResponse,
      providesTags: (result) => blogTags(result),
    }),
    getBlog: builder.query<Blog, string>({
      query: (id) => `/blogs/${encodeURIComponent(id)}`,
      transformResponse: mapApiBlogToBlog,
      providesTags: (_result, _error, id) => [{ type: 'Blogs', id }],
    }),
    deleteBlog: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/blogs/${id}`,
        method: 'DELETE',
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled, getState }) {
        await syncDashboardAfterBlogMutation(id, 'deleted', {
          dispatch,
          queryFulfilled,
          getState,
        })
      },
      invalidatesTags: (_result, _error, id) => [
        { type: 'Blogs', id },
        { type: 'Blogs', id: 'LIST' },
      ],
    }),
    publishBlog: builder.mutation<Blog, string>({
      query: (id) => ({
        url: `/blogs/${id}/publish`,
        method: 'PATCH',
      }),
      transformResponse: mapApiBlogToBlog,
      async onQueryStarted(id, { dispatch, queryFulfilled, getState }) {
        await syncDashboardAfterBlogMutation(id, 'published', {
          dispatch,
          queryFulfilled,
          getState,
        })
      },
      invalidatesTags: (_result, _error, id) => [
        { type: 'Blogs', id },
        { type: 'Blogs', id: 'LIST' },
      ],
    }),
    archiveBlog: builder.mutation<Blog, string>({
      query: (id) => ({
        url: `/blogs/${id}/archive`,
        method: 'PATCH',
      }),
      transformResponse: mapApiBlogToBlog,
      async onQueryStarted(id, { dispatch, queryFulfilled, getState }) {
        await syncDashboardAfterBlogMutation(id, 'archived', {
          dispatch,
          queryFulfilled,
          getState,
        })
      },
      invalidatesTags: (_result, _error, id) => [
        { type: 'Blogs', id },
        { type: 'Blogs', id: 'LIST' },
      ],
    }),
    generateBlogContent: builder.mutation<{ content: string }, { prompt: string }>({
      query: ({ prompt }) => ({
        url: '/generate-blog',
        method: 'POST',
        body: { prompt },
      }),
    }),
    generateCoverImage: builder.mutation<{ url: string }, { prompt: string }>({
      query: ({ prompt }) => ({
        url: '/generate-image',
        method: 'POST',
        body: { prompt },
      }),
    }),
    createBlog: builder.mutation<Blog, CreateBlogRequest>({
      queryFn: async (payload) => {
        const formData = new FormData()
        formData.append('content', payload.content)
        formData.append('status', payload.status)

        if (payload.title?.trim()) {
          formData.append('title', payload.title.trim())
        }

        if (payload.coverImageFile) {
          formData.append('coverImage', payload.coverImageFile)
        } else if (payload.coverImage?.trim()) {
          const cover = payload.coverImage.trim()
          if (/^https?:\/\//i.test(cover)) {
            formData.append('coverImage', cover)
          } else {
            const coverFile = await dataUrlToFile(cover)
            if (coverFile) {
              formData.append('coverImage', coverFile)
            }
          }
        }

        const token = getAccessToken()
        const headers: Record<string, string> = {}
        if (token) {
          headers.Authorization = `Bearer ${token}`
        }

        try {
          const response = await fetch(`${getApiBase()}/blogs`, {
            method: 'POST',
            headers,
            credentials: 'include',
            body: formData,
          })

          const wrapper = (await response.json()) as ApiWrapper<unknown>

          if (!response.ok || !wrapper.success) {
            const details = wrapper.errors
              ? Object.values(wrapper.errors)
                  .flat()
                  .filter(Boolean)
                  .join(' ')
              : ''
            return {
              error: {
                status: response.status,
                data: {
                  message: details || wrapper.message || 'Failed to create blog',
                  errors: wrapper.errors,
                },
              },
            }
          }

          return { data: mapApiBlogToBlog(wrapper.data as Parameters<typeof mapApiBlogToBlog>[0]) }
        } catch {
          return {
            error: {
              status: 'FETCH_ERROR' as const,
              data: { message: 'Network error while creating blog' },
            },
          }
        }
      },
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
          invalidateDashboardAnalytics(dispatch)
        } catch {
          /* handled by caller */
        }
      },
      invalidatesTags: [{ type: 'Blogs', id: 'LIST' }],
    }),
    updateBlog: builder.mutation<Blog, UpdateBlogRequest>({
      queryFn: async ({ id, ...payload }) => {
        const formData = new FormData()

        if (payload.title?.trim()) {
          formData.append('title', payload.title.trim())
        }
        if (payload.content !== undefined) {
          formData.append('content', payload.content)
        }

        if (payload.coverImageFile) {
          formData.append('coverImage', payload.coverImageFile)
        } else if (payload.coverImage?.trim()) {
          const cover = payload.coverImage.trim()
          if (/^https?:\/\//i.test(cover)) {
            formData.append('coverImage', cover)
          } else {
            const coverFile = await dataUrlToFile(cover)
            if (coverFile) {
              formData.append('coverImage', coverFile)
            }
          }
        }

        const token = getAccessToken()
        const headers: Record<string, string> = {}
        if (token) {
          headers.Authorization = `Bearer ${token}`
        }

        try {
          const response = await fetch(`${getApiBase()}/blogs/${encodeURIComponent(id)}`, {
            method: 'PUT',
            headers,
            credentials: 'include',
            body: formData,
          })

          const wrapper = (await response.json()) as ApiWrapper<unknown>

          if (!response.ok || !wrapper.success) {
            const details = wrapper.errors
              ? Object.values(wrapper.errors)
                  .flat()
                  .filter(Boolean)
                  .join(' ')
              : ''
            return {
              error: {
                status: response.status,
                data: {
                  message: details || wrapper.message || 'Failed to update blog',
                  errors: wrapper.errors,
                },
              },
            }
          }

          return { data: mapApiBlogToBlog(wrapper.data as Parameters<typeof mapApiBlogToBlog>[0]) }
        } catch {
          return {
            error: {
              status: 'FETCH_ERROR' as const,
              data: { message: 'Network error while updating blog' },
            },
          }
        }
      },
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Blogs', id },
        { type: 'Blogs', id: 'LIST' },
      ],
    }),
  }),
})

export const {
  useGetBlogsQuery,
  useGetBlogQuery,
  useLazyGetBlogsQuery,
  useDeleteBlogMutation,
  usePublishBlogMutation,
  useArchiveBlogMutation,
  useGenerateBlogContentMutation,
  useGenerateCoverImageMutation,
  useCreateBlogMutation,
  useUpdateBlogMutation,
} = blogsApi
