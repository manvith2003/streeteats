import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api/vendors': 'http://localhost:8081',
      '/api/status': 'http://localhost:8082',
      '/api/menu': 'http://localhost:8083',
      '/api/reviews': 'http://localhost:8084'
    }
  }
})
