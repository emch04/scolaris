# Scolaris 🏫

**Date de création officielle :** Jeudi 22 avril 2026

Une plateforme de gestion scolaire de classe industrielle, ultra-rapide et sécurisée, conçue pour transformer le suivi éducatif.

## ⚡ Performances Records
Scolaris est l'une des plateformes de gestion scolaire les plus rapides au monde :
- 🚀 **Chargement (LCP)** : **0,20 seconde** (Instantané).
- 🧱 **Stabilité (CLS)** : **0** (Parfaite).
- 🖱️ **Réactivité (INP)** : **16-48 ms** (Ultra-fluide).

## 🚀 Capacités PWA Avancées
Scolaris est optimisé pour une expérience native sur mobile :
- 📱 **Installation Directe** : Pas besoin de passer par l'App Store ou le Play Store.
- 💾 **Persistance Hors-ligne** : Stratégie *CacheFirst* et *Stale-While-Revalidate* pour un accès instantané aux données métier sans internet.
- 🔄 **Background Sync** : Synchronisation des données en arrière-plan dès le retour de la connexion.
- ⚖️ **Stabilité Mobile** : Utilisation de `100dvh` et `overscroll-behavior: none` pour un comportement d'application fluide et sans rebonds.
- **🔒 Haute Sécurité** : 
  - **Cookies HTTP-Only** : Protection bancaire contre le vol de session.
  - **Refresh Tokens** : Maintien de la connexion sécurisée sur 30 jours.
- **📄 Exportation & Certification** :
  - Génération de **Bulletins PDF** professionnels en un clic.
  - Exportation des Emplois du temps certifiés.
- **☁️ Stockage Hybride** : 
  - Intégration native avec **Cloudinary** pour une persistance infinie des documents.
- **📊 Analytics en temps réel** :
  - **Pour les Profs** : Taux de réussite et moyenne de classe automatique.
  - **Pour les Parents** : Suivi des signatures et absences en direct.
- **💬 Communication Moderne** :
  - Messagerie privée, Chat de classe et Communiqués officiels avec pièces jointes.

## 🛠️ Stack Technique

- **Frontend** : React 18 (Vite), CSS Vanilla (Glassmorphism), Service Workers (PWA).
- **Backend** : Node.js, Express, MongoDB (Mongoose).
- **Infrastructure** : Cloudinary (Médias), Vercel/Render, MongoDB Atlas.

## ⚙️ Configuration Rapide

### 1. Backend
```bash
cd backend
npm install
# Configurez votre .env (Port 5001, MONGODB_URI, CLOUDINARY_KEYS)
node seed.js 
npm run dev
```

### 2. Frontend
```bash
cd ../frontend
npm install
npm run dev
```

## 📝 Documentation Complète
- **[Architecture Technique](./docs/ARCHITECTURE.md)**
- **[Guide Utilisateur](./docs/GUIDE_UTILISATEUR.md)**
- **[Plan d'Évolution](./docs/evolution.md)**

---
Développé avec passion par **Emmanouch** pour moderniser l'éducation. 
