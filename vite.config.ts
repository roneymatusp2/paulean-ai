import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { serveStaticHtml } from './src/vite-serve-static'

export default defineConfig({
  plugins: [react(), serveStaticHtml()],
  server: {
    fs: {
      allow: ['..']
    }
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: './index.html'
    }
  }
})