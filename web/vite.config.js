import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: { enabled: true }, 
      manifest: {
        name: 'ClickMart',
        short_name: 'ClickMart',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        background_color: '#0b1220',
        theme_color: '#0b1220',
        icons: [
          { src: '/icons/444.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/icons/555.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: '/icons/666.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
        ],
        
      }
    })
  ],
  server: { open: true }
})
