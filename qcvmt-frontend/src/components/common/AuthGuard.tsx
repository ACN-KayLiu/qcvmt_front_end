import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { Spin } from 'antd'
import { getStoredAuthTokens } from '@/api/auth'
import { useAuthStore } from '@/stores/auth'

export const AuthGuard = () => {
  const location = useLocation()
  const loading = useAuthStore((state) => state.loading)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const hasTokens = Boolean(getStoredAuthTokens()?.accessToken)

  if (loading) {
    return <Spin fullscreen />
  }

  if (location.pathname.startsWith('/terminal')) {
    return <Outlet />
  }

  if (!isAuthenticated || !hasTokens) {
    const from = `${location.pathname}${location.search}${location.hash}`
    return <Navigate to="/login" replace state={{ from }} />
  }

  return <Outlet />
}
