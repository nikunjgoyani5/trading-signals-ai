import { createApi } from '@reduxjs/toolkit/query/react'
import { clearAccessToken, setAccessToken } from '../../lib/authStorage'
import type { AuthUser, LoginRequest, LoginResponse } from '../../types/auth'
import { baseQueryWithAuth } from './baseQuery'

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['User'],
  endpoints: (builder) => ({
    getMe: builder.query<AuthUser, void>({
      query: () => '/auth/me',
      transformResponse: (response: { user: AuthUser }) => response.user,
      providesTags: ['User'],
    }),

    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
      async onQueryStarted({ rememberMe }, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled
        setAccessToken(data.accessToken, rememberMe)
        dispatch(
          authApi.util.upsertQueryData('getMe', undefined, data.user),
        )
      },
      invalidatesTags: ['User'],
    }),

    refreshSession: builder.mutation<{ user: AuthUser; accessToken: string }, void>({
      query: () => ({
        url: '/auth/refresh',
        method: 'POST',
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        const { data } = await queryFulfilled
        const rememberMe = Boolean(localStorage.getItem('tsai.accessToken.remember'))
        setAccessToken(data.accessToken, rememberMe)
      },
      invalidatesTags: ['User'],
    }),

    logout: builder.mutation<null, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
        } finally {
          clearAccessToken()
          dispatch(authApi.util.resetApiState())
        }
      },
    }),

    forgotPassword: builder.mutation<{ message: string; emailSent?: boolean }, { email: string }>({
      query: (body) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body,
      }),
    }),

    resetPassword: builder.mutation<{ message: string }, { token: string; password: string }>({
      query: (body) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body,
      }),
    }),
  }),
})

export const {
  useGetMeQuery,
  useLazyGetMeQuery,
  useLoginMutation,
  useRefreshSessionMutation,
  useLogoutMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi
