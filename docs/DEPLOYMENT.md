# Guide de Déploiement Scolaris 🚀

Ce document explique comment héberger la plateforme Scolaris en ligne.

## 📡 Étape 1 : Hébergement du Backend (API)
**Hébergeurs recommandés :** Render, Railway, ou Heroku.

1.  **Créer un projet** lié à votre dépôt GitHub.
2.  **Configurer le Root Directory :** `backend`
3.  **Commande de Build :** `npm install`
4.  **Commande de Start :** `npm start`
5.  **Variables d'Environnement (Environment Variables) :**
    *   `PORT` : 5000 (ou laisser par défaut)
    *   `MONGODB_URI` : Votre URL de connexion MongoDB Atlas.
    *   `JWT_SECRET` : Une clé secrète longue et complexe.
    *   `FRONTEND_URL` : L'URL finale de votre site (ex: `https://scolaris.vercel.app`).

## 💻 Étape 2 : Hébergement du Frontend (Client)
**Hébergeurs recommandés :** Vercel, Netlify, ou Cloudflare Pages.

1.  **Créer un projet** lié à votre dépôt GitHub.
2.  **Configurer le Root Directory :** `frontend`
3.  **Framework Preset :** Vite
4.  **Commande de Build :** `npm run build`
5.  **Output Directory :** `dist`
6.  **Variables d'Environnement :**
    *   `VITE_API_BASE_URL` : L'URL de votre backend + `/api` (ex: `https://api-scolaris.onrender.com/api`).

## 🗄️ Étape 3 : Base de Données (MongoDB Atlas)
1.  Créer un cluster gratuit sur [MongoDB Atlas](https://www.mongodb.com/atlas).
2.  Ajouter `0.0.0.0/0` à la liste d'accès IP (Network Access) pour permettre aux hébergeurs de se connecter.
3.  Récupérer la chaîne de connexion (Connection String) et l'utiliser pour la variable `MONGODB_URI` du backend.

## 📁 Gestion des fichiers (Uploads)
Actuellement, les fichiers sont stockés localement sur le serveur. 
*Note : Sur des hébergeurs comme Vercel ou Render (plan gratuit), les fichiers peuvent être supprimés au redémarrage. Pour un usage intensif en ligne, il est conseillé d'utiliser un service de stockage externe (Cloudinary ou AWS S3).*

## ✅ Vérification finale
Une fois les deux parties en ligne :
1. Testez la connexion avec un compte existant.
2. Vérifiez que les images et PDF s'ouvrent correctement.
3. Testez la messagerie en temps réel.
ouf
