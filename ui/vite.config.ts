import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, '../src/shared'),
      'src': path.resolve(__dirname, 'src')
    }
  },
  build: {
    // Disable minification and other optimizations for fast builds in development mode
    minify: mode === 'development' ? false : 'esbuild',
    sourcemap: mode === 'development' ? true : false,
    cssMinify: mode === 'development' ? false : true,
    rollupOptions: {
      output: {
        // Skip chunk optimization for faster builds
        manualChunks: mode === 'development' ? undefined : (id) => {
          if (id.includes('node_modules')) {
            return 'vendor'
          }
        }
      }
    }
  }
}))
