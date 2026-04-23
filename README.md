# Scolaris 🏫

Une plateforme de gestion scolaire légère et moderne, conçue pour faciliter le suivi des élèves, des classes et des devoirs.

## 🚀 Fonctionnalités

- **Authentification Sécurisée** : Connexion pour les enseignants, directeurs et administrateurs via JWT.
- **Gestion des Écoles** : Enregistrement et suivi des établissements partenaires.
- **Gestion des Classes** : Création de classes avec attribution de titulaires.
- **Gestion des Élèves** : Inscription des élèves avec génération automatique de matricules uniques.
- **Système de Devoirs** : Publication de leçons et devoirs par les enseignants, avec possibilité de joindre des fichiers (PDF, documents, images).
- **Module Communications** : Diffusion de communiqués officiels et de convocations aux parents et élèves.
- **Espace Parent** : Interface dédiée permettant aux parents de suivre les devoirs de leurs enfants et de consulter les communications de l'école.
- **Contrôle d'Accès (RBAC)** : Permissions différenciées selon les rôles (Admin, Directeur, Enseignant, Parent). Seuls les Admins peuvent ajouter des écoles.
- **Design Moderne & Épuré** : Nouvelle interface visuelle optimisée, plus rapide et professionnelle.
- **Signature Numérique Sécurisée** : Validation des devoirs par les parents via un code de sécurité simulation (OTP).
- **Déconnexion Automatique** : Protection des sessions avec déconnexion après 15 minutes d'inactivité.
- **Maintenance Automatisée** : Audit de santé et de sécurité hebdomadaire via GitHub Actions.

## 🛠️ Stack Technique

- **Backend** : Node.js, Express.js, MongoDB (Mongoose), JWT.
- **Frontend** : React.js (Vite), React Router, Axios, CSS Vanilla.
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

## 🔑 Identifiants de test (après seed)
- **Email** : `
- **Mot de passe** : ``

## 📝 Licence
Ce projet est développé pour le secteur éducatif.

---

## 🗺️ Roadmap (Évolutions à venir)

- [ ] **Notifications SMS Réelles** : Intégration d'une passerelle (Twilio/Vonage) pour l'envoi des codes OTP et des alertes.
- [ ] **Paiement des Frais** : Module de paiement en ligne des frais de scolarité (Mobile Money).
- [ ] **Emploi du Temps** : Planning interactif des cours pour chaque classe.
- [ ] **Gestion des Absences** : Suivi en temps réel de la présence des élèves.
