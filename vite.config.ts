import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // Progressive Web App plugin configuration
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'favicon.svg', 'apple-touch-icon.png'],
      workbox: {
        navigateFallbackDenylist: [/^\/api\//]
      },
      manifest: {
        name: 'Wellora Mama',
        short_name: 'Wellora',
        description: 'AI‑powered maternal wellness companion',
        theme_color: '#c05e45',
        background_color: '#fdf8f5',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          { src: '/images/wellora-mama-logo.png', sizes: '48x48', type: 'image/png' },
          { src: '/images/wellora-mama-logo.png', sizes: '96x96', type: 'image/png' },
          { src: '/images/wellora-mama-logo.png', sizes: '192x192', type: 'image/png' },
          { src: '/images/wellora-mama-logo.png', sizes: '512x512', type: 'image/png' }
        ]
      }
    })
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      }
    }
  }
});
