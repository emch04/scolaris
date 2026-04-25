# Scolaris 🏫

**Date de création officielle :** Jeudi 22 avril 2026

Une plateforme de gestion scolaire de classe industrielle, ultra-rapide et sécurisée, conçue pour transformer le suivi éducatif.

## ⚡ Performances Records
Scolaris est l'une des plateformes de gestion scolaire les plus rapides au monde :
- 🚀 **Chargement (LCP)** : **0,20 seconde** (Instantané).
- 🧱 **Stabilité (CLS)** : **0** (Parfaite).
- 🖱️ **Réactivité (INP)** : **16-48 ms** (Ultra-fluide).

## 🚀 Dernières Améliorations (V1.1)
- 📱 **Optimisation Responsive Totale** : L'interface s'adapte désormais parfaitement aux smartphones, tablettes et ordinateurs, avec des composants redimensionnés pour chaque support.
- ⚡ **Système de Cache Hybride** : Utilisation de Redis (si disponible) ou de la mémoire locale pour accélérer les calculs complexes (statistiques, rapports).
- 📄 **Pagination des Données** : Implémentation de la pagination pour les listes volumineuses (élèves), garantissant des performances constantes.
- 💬 **Clavier d'Emojis Intégré** : Nouveau sélecteur d'emojis dans le chat pour faciliter la communication.
- 🔗 **Smart Links** : Les devoirs et messages sont désormais liés pour faciliter la communication entre parents, élèves et professeurs.

## 🚀 Capacités PWA Avancées
Scolaris est une PWA complète qui offre une expérience proche d'une application native :
- 📱 **Installation Directe** : Pas besoin de passer par l'App Store ou le Play Store.
- 💾 **Persistance Hors-ligne** : Stratégie *CacheFirst* et *Stale-While-Revalidate* pour un accès instantané aux données métier sans internet.
- 🔄 **Background Sync** : Mise en file d'attente des actions utilisateur effectuées hors-ligne pour exécution automatique dès le retour du réseau.
- ⚖️ **Stabilité Mobile** : Utilisation de `100dvh` et `overscroll-behavior: none` pour un comportement d'application fluide et sans rebonds.
- **🔒 Haute Sécurité** : 
  - **Cookies HTTP-Only** : Protection contre le vol de session (XSS).
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
  - Messagerie privée, Chat de classe avec emojis et Communiqués officiels avec pièces jointes.

## 🛠️ Stack Technique

- **Frontend** : React 18 (Vite), CSS Vanilla (Glassmorphism), Service Workers (PWA).
- **Backend** : Node.js, Express, MongoDB (Mongoose), Redis (Cache).
- **Infrastructure** : Cloudinary (Médias), Vercel/Render, MongoDB Atlas.

## ⚙️ Configuration Rapide

### 1. Backend
```bash
cd backend
npm install
# Configurez votre .env (Port 5001, MONGODB_URI, CLOUDINARY_KEYS, REDIS_URL)
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
