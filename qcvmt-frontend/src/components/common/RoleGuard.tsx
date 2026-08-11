import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth'

interface RoleGuardProps {
  allowedRoles: string[]
}

export const RoleGuard = ({ allowedRoles }: RoleGuardProps) => {
  const roles = useAuthStore((state) => state.roles)
  const matched = roles.some((role) => allowedRoles.includes(role))

  if (!matched) {
    return <Navigate to="/terminal" replace />
  }

  return <Outlet />
}
