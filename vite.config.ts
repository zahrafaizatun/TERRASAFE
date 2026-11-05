import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Konfigurasi untuk GitHub Pages:
// Repository: https://github.com/AnggunAzalia/TERRASAFEE
export default defineConfig({
  // Penting: sesuaikan dengan nama repository GitHub (huruf besar/kecil harus sama).
  base: '/TERRASAFEE/',
  plugins: [react()],
  server: {
    port: 3000,
    open: false,
    host: true
  },
  build: {
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          three: ['three'],
          charts: ['chart.js', 'react-chartjs-2'],
          leaflet: ['leaflet']
        }
      }
    }
  }
});
