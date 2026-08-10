import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

const getPackageName = (id: string): string | null => {
  const segment = id.split('node_modules/')[1]
  if (!segment) {
    return null
  }
  const parts = segment.split('/')
  if (parts[0].startsWith('@')) {
    return `${parts[0]}/${parts[1] ?? ''}`
  }
  return parts[0]
}

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://172.17.92.38:8080',
        changeOrigin: true,
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            // Dev-only workaround: prevent backend CORS origin validation from rejecting proxied requests.
            proxyReq.removeHeader('origin')
          })
        },
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) {
            return undefined
          }

          const pkg = getPackageName(id)
          if (!pkg) {
            return 'vendor-misc'
          }

          if (['react', 'react-dom', 'scheduler', 'use-sync-external-store'].includes(pkg)) {
            return 'vendor-react'
          }

          if (['react-router', 'react-router-dom', '@remix-run/router'].includes(pkg)) {
            return 'vendor-router'
          }

          if (
            [
              'antd',
              '@ant-design/colors',
              '@ant-design/cssinjs',
              '@ant-design/fast-color',
            ].includes(pkg)
          ) {
            return 'vendor-antd'
          }

          if (['@ant-design/icons', '@ant-design/icons-svg'].includes(pkg)) {
            return 'vendor-ant-icons'
          }

          if (pkg.startsWith('rc-') || pkg.startsWith('@rc-component/')) {
            return 'vendor-antd'
          }

          if (['i18next', 'react-i18next'].includes(pkg)) {
            return 'vendor-i18n'
          }

          if (
            [
              'axios',
              'dayjs',
              'keycloak-js',
              'zustand',
              'react-hook-form',
              '@hookform/resolvers',
              'zod',
            ].includes(pkg)
          ) {
            return 'vendor-core'
          }

          return undefined
        },
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/tests/setup.ts',
    css: true,
  },
})
