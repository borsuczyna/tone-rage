import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [vue()],
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
        preserveModules: false,
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
