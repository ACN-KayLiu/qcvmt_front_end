import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { Spin } from 'antd'
import { ErrorBoundary } from '@/app/ErrorBoundary'
import { router } from '@/router'
import { useAuthStore } from '@/stores/auth'

function App() {
  const hydrateUser = useAuthStore((state) => state.hydrateUser)
  const loading = useAuthStore((state) => state.loading)

  useEffect(() => {
    const bootstrap = async () => {
      await hydrateUser()
    }

    void bootstrap()
  }, [hydrateUser])

  if (loading) {
    return <Spin fullscreen />
  }

  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  )
}

export default App
