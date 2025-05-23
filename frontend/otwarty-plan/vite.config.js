import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://51.38.135.103',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
