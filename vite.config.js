import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3030,
    proxy: {
      '/v2': {
        target: 'https://docker-registry.softwarekom.com',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
