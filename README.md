# Scolaris 🏫

Une plateforme de gestion scolaire de classe industrielle, ultra-rapide et sécurisée, conçue pour transformer le suivi éducatif.

## ⚡ Performances Records
Scolaris est l'une des plateformes de gestion scolaire les plus rapides au monde :
- 🚀 **Chargement (LCP)** : **0,20 seconde** (Instantané).
- 🧱 **Stabilité (CLS)** : **0** (Parfaite).
- 🖱️ **Réactivité (INP)** : **16-48 ms** (Ultra-fluide).

## 🚀 Fonctionnalités Clés

- **📱 Application Mobile (PWA)** : 
  - Installable sur iOS, Android et Desktop.
  - **Mode Hors-ligne** : Consultation des devoirs et de l'emploi du temps même sans connexion internet.
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
