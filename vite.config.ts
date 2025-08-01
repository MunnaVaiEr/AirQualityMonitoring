import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
   build: {
    sourcemap: false,
  },
  server: {
    proxy: {
      '/api': 'http://127.0.0.1:8000'
    },
  },
});

