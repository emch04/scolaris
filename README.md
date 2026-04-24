# Scolaris 🏫

Une plateforme de gestion scolaire complète, légère et moderne, conçue pour transformer le suivi éducatif.

## 🚀 Fonctionnalités Clés

- **Authentification & Inscriptions** : 
  - Connexion sécurisée via JWT (Email ou Matricule).
  - **Inscriptions Publiques Strictes** : Les Parents (via matricule enfant), Élèves (via code école) et Enseignants peuvent créer leurs comptes en toute autonomie.
  - **Récupération de Mot de Passe** : Système complet par e-mail via code OTP réel.
- **Gestion des Établissements** : Enregistrement, suivi et validation des écoles partenaires.
- **Organisation Pédagogique** : 
  - Création de classes et attribution des professeurs titulaires.
  - **Plan de Cours Annuel** : Publication du programme et des objectifs par les enseignants avec fichiers joints.
  - **Gestion du Temps** : Emploi du temps interactif géré par la Direction et les Enseignants.
- **Suivi des Élèves** : 
  - **Inscriptions Centralisées** : Seule la Direction peut inscrire de nouveaux élèves pour garantir l'intégrité des données.
  - Génération automatique de matricules uniques.
  - **Tableau de Bord Professeur** : Visualisation immédiate de la moyenne de classe et du taux de réussite.
  - **Bulletins Numériques** : Consultation des notes et moyennes par période.
  - **Gestion des Absences** : Appel numérique pour les profs et suivi en temps réel pour les parents.
- **Calendrier Scolaire Moderne** : Vue mensuelle interactive avec indicateurs visuels pour les événements, examens et congés.
- **Communication & Collaboration** :
  - **Navigation Parent Optimisée** : Accès rapide à la messagerie et aux devoirs depuis le tableau de bord.
  - **Messagerie Intelligente** : Auto-sélection des destinataires pour simplifier les échanges.
  - **Chat de Classe** : Espace collaboratif sécurisé par classe.
  - **Communiqués Officiels** : Diffusion de messages importants avec pièces jointes.
- **Bibliothèque Numérique** : Partage de ressources (livres, exercices, vidéos) avec accès restreint selon le rôle.
- **Sécurité Avancée** : 
  - Déconnexion automatique après 15 min d'inactivité.
  - Détection dynamique de l'environnement (Local vs Production).
  - Contrôle d'accès strict (RBAC).

## 🛠️ Stack Technique

- **Frontend** : React.js (Vite), React Router, Axios, Context API, CSS Vanilla (Design Glassmorphism).
- **Backend** : Node.js, Express.js, MongoDB (Mongoose), Nodemailer (Emails), Multer (Fichiers).
- **Infrastucture** : Vercel (Frontend), Render (Backend), MongoDB Atlas (Cloud Database).

## 📁 Structure du Projet

```text
scolaris/
├── backend/                # API REST Node.js
├── frontend/               # Application React (Vite)
├── docs/                   # Documentation technique et utilisateur
└── maintenance-agent/      # Agent spécialisé (Audit & Sécurité)
```

## ⚙️ Installation Rapide

### 1. Backend
```bash
cd backend
npm install
# Configurez votre .env (MongoDB, JWT_SECRET, EMAIL_USER, EMAIL_PASS)
node seed.js # Création du compte admin initial
npm run dev
```

### 2. Frontend
```bash
cd ../frontend
npm install
# Configurez votre .env (VITE_API_BASE_URL)
npm run dev
```

## 🔑 Identifiants de test (après seed)
- **Super Admin** : `admin@scolaris.cd` / `superadmin123`
- **Professeur** : `prof@scolaris.cd` / `prof123`
- **Parent** : `parent@demo.cd` / `parent123`

## 📝 Documentation Complète
- **[Architecture Technique](./docs/ARCHITECTURE.md)**
- **[Charte UI/UX](./docs/UI_UX_GUIDELINES.md)**
- **[Guide Utilisateur](./docs/GUIDE_UTILISATEUR.md)**

---
Développé par emmanouch avec passion pour moderniser l'éducation. 
