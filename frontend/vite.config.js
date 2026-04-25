/**
 * @file vite.config.js
 * @description Configuration de Vite pour le projet Scolaris.
 * Inclut la configuration du plugin React et la gestion de la PWA (Progressive Web App)
 * pour assurer une expérience fluide sur mobile et une disponibilité hors-ligne.
 */

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    // Support de React avec Fast Refresh
    react(),
    
    // Configuration de la PWA pour une installation facile sur mobile
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Scolaris - Gestion Scolaire',
        short_name: 'Scolaris',
        description: 'La plateforme de gestion scolaire moderne pour la RDC',
        theme_color: '#0a0a0a',
        background_color: '#0a0a0a',
        display: 'standalone',
        icons: [
          {
            src: '/assets/image.jpg',
            sizes: '192x192',
            type: 'image/jpeg'
          },
          {
            src: '/assets/image.jpg',
            sizes: '512x512',
            type: 'image/jpeg'
          }
        ]
      },
      workbox: {
        // Mise en cache des ressources statiques pour l'usage hors-ligne
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg}'],
        
        // Stratégie de mise en cache pour l'API (Réseau d'abord, puis cache)
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/scolaris-fucv\.onrender\.com\/api\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              networkTimeoutSeconds: 15, 
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 7 // Durée de rétention : 1 semaine
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ],
})