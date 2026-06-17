import { configureStore } from '@reduxjs/toolkit'
import { authApi } from './api/authApi'
import { blogsApi } from './api/blogsApi'
import { dashboardApi } from './api/dashboardApi'

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [blogsApi.reducerPath]: blogsApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      blogsApi.middleware,
      dashboardApi.middleware,
    ),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
