# Scolaris 🏫

Une plateforme de gestion scolaire légère et moderne, conçue pour faciliter le suivi des élèves, des classes et des devoirs.

## 🚀 Fonctionnalités

- **Authentification Sécurisée** : Connexion pour les enseignants, directeurs et administrateurs via JWT.
- **Gestion des Écoles** : Enregistrement et suivi des établissements partenaires.
- **Gestion des Classes** : Création de classes avec attribution de titulaires.
- **Gestion des Élèves** : Inscription des élèves avec génération automatique de matricules uniques.
- **Système de Devoirs** : Publication de leçons et devoirs par les enseignants, avec possibilité de joindre des fichiers (PDF, documents, images).
- **Gestion des Absences** : Module complet permettant aux enseignants de faire l'appel et aux parents de suivre l'historique des présences en temps réel.
- **Emploi du Temps** : Planning interactif des cours par classe, géré par l'administration.
- **Calendrier Scolaire** : Planification centralisée des événements, congés et examens par le Super Admin et les Directeurs.
- **Plan de Cours Annuel** : Publication du programme pédagogique par les enseignants, consultable par les parents et élèves.
- **Messagerie & Collaboration** :
  - **Messages Privés** : Échanges sécurisés selon une hiérarchie stricte.
  - **Chat de Classe** : Espace de discussion de groupe pour le travail collaboratif entre élèves et professeurs.
- **Bibliothèque Numérique** : Ressources (livres, exercices, vidéos) réservées aux élèves, professeurs et directeurs.
- **Tableau de Bord Visuel** :
  - **Super Admin** : Vue globale du réseau (écoles, parents, enseignants, classes) et statistiques de croissance.
  - **Direction** : Gestion locale complète des parents et élèves de l'établissement.
- **Confidentialité & Sécurité** : 
  - Accès restreint aux données sensibles (le Super Admin ne voit pas la liste des parents).
  - Filtrage des communications pour préserver l'autonomie des écoles.

## 🛠️ Stack Technique

- **Backend** : Node.js, Express.js, MongoDB (Mongoose), JWT.
- **Frontend** : React.js (Vite), React Router, Axios, Context API (Theme, Auth, Toasts), CSS Vanilla.
- **Base de données** : MongoDB Atlas.
- **Maintenance** : GitHub Actions, Scripts d'audit de sécurité.

## 📁 Structure du Projet

```text
scolaris/
├── backend/                # API REST Node.js
├── frontend/               # Application React
├── maintenance-agent/      # Agent spécialisé (Audit & Sécurité)
│   ├── scripts/            # Script d'audit automatisé
│   └── references/         # Checklist de sécurité
└── .github/workflows/      # Automatisation CI/CD (GitHub Actions)
```
## ⚙️ Installation et Démarrage

### 1. Cloner le projet
```bash
git clone https://github.com/emch04/scolaris.git
cd scolaris
```

### 2. Configuration du Backend
```bash
cd backend
npm install
# Créez votre fichier .env basé sur .env.example
node seed.js # Pour créer le compte admin initial
npm run dev
```

### 3. Configuration du Frontend
```bash
cd ../frontend
npm install
# Créez votre fichier .env basé sur .env.example
npm run dev
```

## 🚀 Mise en ligne (Déploiement)

Le projet est entièrement configuré pour être hébergé en ligne. Consultez le **[Guide de Déploiement](./docs/DEPLOYMENT.md)** pour les instructions pas-à-pas (Vercel, Render, MongoDB Atlas).

## 🔑 Identifiants de test (après seed)
- **Super Admin** : `admin@scolaris.cd` / `superadmin123`
- **Professeur** : `prof@scolaris.cd` / `prof123`
- **Parent** : `parent@demo.cd` / `parent123`

## 📝 Licence
Ce projet est développé pour le secteur éducatif.

---

## 🗺️ Roadmap (Évolutions à venir)

- [ ] **Notifications SMS Réelles** : Intégration d'une passerelle (Twilio/Vonage) pour l'envoi des codes OTP et des alertes.
- [ ] **Paiement des Frais** : Module de paiement en ligne des frais de scolarité (Mobile Money).
- [ ] **Export PDF** : Génération des bulletins de notes et certificats au format PDF.
- [x] **Emploi du Temps** : Planning interactif des cours pour chaque classe.
- [x] **Gestion des Absences** : Suivi en temps réel de la présence des élèves.
- [x] **Messagerie** : Système de discussion interne.
