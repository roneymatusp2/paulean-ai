import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    devSourcemap: true,
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
  publicDir: 'public',
  server: {
    hmr: {
      overlay: true,
    },
    // Ensure all files in public are served
    fs: {
      strict: false,
      allow: ['..']
    },
    // Configure mime types for HTML files
    headers: {
      'Content-Type': 'text/html'
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    // Ensure public files are copied to dist
    copyPublicDir: true,
    rollupOptions: {
      input: {
        main: './index.html',
      }
    }
  },
  // Ensure proper handling of HTML files
  assetsInclude: ['**/*.html']
})
