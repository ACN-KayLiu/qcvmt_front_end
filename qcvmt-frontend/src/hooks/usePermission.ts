import { useMemo } from 'react'
import { useAuthStore } from '@/stores/auth'

export const usePermission = () => {
  const roles = useAuthStore((state) => state.roles)

  const isAdmin = useMemo(() => roles.includes('qcvmt-admin'), [roles])

  const hasRole = (role: string): boolean => roles.includes(role)

  return {
    roles,
    isAdmin,
    hasRole,
  }
}
