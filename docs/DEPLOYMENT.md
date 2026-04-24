# Guide de Déploiement Scolaris 🚀

Ce document explique comment héberger la plateforme Scolaris en ligne.

## 📡 Étape 1 : Backend (API REST)
- **Port** : 5001
- **Variables Cruciales** : 
    - `MONGODB_URI` : URL MongoDB Atlas.
    - `JWT_SECRET` : Clé de cryptage des sessions.
    - `CLOUDINARY_KEYS` : Obligatoire pour la persistance des fichiers sur Render/Heroku.
    - `CLIENT_URL` : URL de votre frontend pour le CORS.

## 💻 Étape 2 : Frontend (React Vite)
- **Mode PWA** : Le build génère automatiquement le Service Worker pour le mode hors-ligne.
- **Variable** : `VITE_API_BASE_URL` (URL du backend + /api).

## 📁 Gestion des fichiers (Cloudinary)
Scolaris est configuré pour détecter automatiquement Cloudinary. Sur les serveurs modernes (sans disque physique permanent), c'est la seule méthode pour garantir que les bulletins et devoirs ne sont jamais perdus.

## ✅ Test de Mise en Service
1. Installez l'app sur mobile pour vérifier le mode PWA.
2. Téléchargez un PDF pour tester Cloudinary.
3. Vérifiez que la déconnexion automatique fonctionne après 15 min.
