import { useCallback, useMemo } from 'react'
import { getAccessToken } from '../lib/authStorage'
import {
  useGetMeQuery,
  useLoginMutation,
  useLogoutMutation,
} from '../redux/api/authApi'

export function useAuth() {
  const hasToken = Boolean(getAccessToken())

  const {
    data: user,
    isLoading,
    isFetching,
    isError,
  } = useGetMeQuery(undefined, { skip: !hasToken })

  const [loginMutation, { isLoading: isLoggingIn }] = useLoginMutation()
  const [logoutMutation] = useLogoutMutation()

  const login = useCallback(
    async (email: string, password: string, rememberMe: boolean) => {
      await loginMutation({ email, password, rememberMe }).unwrap()
    },
    [loginMutation],
  )

  const logout = useCallback(async () => {
    await logoutMutation()
  }, [logoutMutation])

  return useMemo(
    () => ({
      user: user ?? null,
      isLoading: hasToken && (isLoading || isFetching),
      isLoggingIn,
      isAuthenticated: Boolean(user && hasToken),
      isError,
      login,
      logout,
    }),
    [user, hasToken, isLoading, isFetching, isLoggingIn, isError, login, logout],
  )
}
