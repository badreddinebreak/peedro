import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Determine the API key based on environment
    'process.env.API_KEY': JSON.stringify(process.env.VITE_API_KEY || process.env.API_KEY)
  },
  build: {
    target: 'esnext' // Needed for top-level await support if used, and modern features
  }
});