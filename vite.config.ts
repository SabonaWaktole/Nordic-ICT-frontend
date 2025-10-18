import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const target = env.VITE_PROXY_TARGET || 'http://localhost:8080'
  return {
    plugins: [react()],
    server: {
      proxy: {
        // Forward all API calls to your backend; set VITE_PROXY_TARGET in .env if needed
        '/api': {
          target,
          changeOrigin: true,
          // Keep the /api prefix on the proxied request. If your backend expects no prefix, enable rewrite.
          // rewrite: (path) => path.replace(/^\/api/, ''),
          secure: false,
        },
      },
    },
  }
})
