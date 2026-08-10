import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from '@/App'
import { AppProviders } from '@/app/AppProviders'
import '@/styles/global.css'
import '@/lib/i18n'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </StrictMode>,
)
