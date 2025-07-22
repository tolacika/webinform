import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
     proxy: {
      '/api': {
        target: 'http://php:80',
        changeOrigin: true,
      }
    },
    port: 3000,
    strictPort: true,
    host: true,
    cors: true
  }
})
