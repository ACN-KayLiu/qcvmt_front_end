import { Outlet } from 'react-router-dom'
import { AppShellLayout } from '@/components/layout/AppShellLayout'

const TerminalLayout = () => {
  return (
    <AppShellLayout>
      <Outlet />
    </AppShellLayout>
  )
}

export default TerminalLayout
