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
      registerType: 'prompt', // Changé à prompt pour mieux gérer les mises à jour critiques
      injectRegister: 'auto',
      workbox: {
        // Mise en cache exhaustive des ressources statiques
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg}'],
        
        // Autorise la synchronisation en arrière-plan
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,

        // Stratégies de mise en cache dynamique (Offline Mode)
        runtimeCaching: [
          {
            // STRATÉGIE CACHE FIRST : Pour les images et médias (chargement instantané)
            urlPattern: /\.(?:png|gif|jpg|jpeg|svg|webp|ico)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 jours
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            },
          },
          {
            // STRATÉGIE CACHE FIRST : Pour les polices d'écriture
            urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 an
              },
            },
          },
          {
            // API : Stratégie NetworkFirst (pour localhost ET production)
            urlPattern: /\/api\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-data-cache',
              networkTimeoutSeconds: 5, // Retourne au cache si le réseau est lent (5 secondes)
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 7,
              },
              backgroundSync: {
                name: 'api-sync-queue',
                options: {
                  maxRetentionTime: 60 * 24
                }
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