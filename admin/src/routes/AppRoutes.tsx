import { createBrowserRouter, Navigate } from 'react-router-dom'
import AdminLayout from '../components/layout/AdminLayout'
import PublicLayout from '../components/layout/PublicLayout'
import AllBlogs from '../pages/AllBlogs'
import CreateBlogPage from '../pages/CreateBlogPage'
import Dashboard from '../pages/Dashboard'
import EditBlogPage from '../pages/EditBlogPage'
import ForgotPassword from '../pages/ForgotPassword'
// import LandingPage from '../pages/LandingPage'
import Login from '../pages/Login'
import ResetPassword from '../pages/ResetPassword'
import ProtectedRoute from './ProtectedRoute'

const AppRoutes = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      {
        path: '/',
        element: <Login />,
        // element: <LandingPage />,
      },
      {
        path: '/login',
        element: <Navigate to="/" replace />,
      },
      {
        path: '/forgot-password',
        element: <ForgotPassword />,
      },
      {
        path: '/reset-password',
        element: <ResetPassword />,
      },
    ],
  },
  {
    path: '/admin',
    element: <ProtectedRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
          {
            path: 'dashboard',
            element: <Dashboard />,
          },
          {
            path: 'blogs',
            element: <AllBlogs />,
          },
          {
            path: 'blogs/create',
            element: <CreateBlogPage />,
          },
          {
            path: 'blogs/edit/:blogId',
            element: <EditBlogPage />,
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])

export default AppRoutes
