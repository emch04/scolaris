# Architecture de Scolaris 🏗️

Ce document décrit la structure technique de la plateforme Scolaris.

## 🧱 Architecture Globale
Scolaris repose sur une architecture **MERN** (MongoDB, Express, React, Node.js) découplée en deux parties :

1.  **Backend (API REST)** : Gère la logique métier, la sécurité (JWT) et la base de données.
2.  **Frontend (SPA)** : Interface utilisateur réactive construite avec React et Vite. Utilisation de la Context API pour la gestion de l'état global (**Auth**, **Theme**, **Toasts**).

## 🔐 Système de Sécurité
- **Authentification** : Utilisation de JSON Web Tokens (JWT) stockés de manière sécurisée.
- **Autorisations (RBAC)** : Les accès sont contrôlés par rôles : `super_admin`, `admin`, `director`, `teacher`, `parent`.
  - `super_admin` : Accès global, gestion des écoles.
  - `admin` : Gestion administrative d'une école spécifique.
- **Validation OTP** : Système de code à usage unique (simulé via console) pour la signature numérique des devoirs.
- **Gestion de Session** : Déconnexion automatique après 15 minutes d'inactivité (côté client via `AuthContext`) pour prévenir les accès non autorisés sur des postes partagés.

## 🛠️ Maintenance et Audit
La plateforme intègre un **Agent de Maintenance** dédié :
- **Scripts d'Audit** : Vérification des vulnérabilités (npm audit) et de l'état des serveurs.
- **Automatisation** : Intégration avec GitHub Actions (`.github/workflows/maintenance-audit.yml`) pour des audits hebdomadaires et lors de chaque mise à jour de code.

## 📂 Structure des Données (MongoDB)
- **Schools** : Établissements scolaires.
- **Classrooms** : Classes liées aux écoles.
- **Teachers** : Utilisateurs staff.
- **Students** : Élèves avec matricules uniques.
- **Parents** : Utilisateurs liés à un ou plusieurs élèves.
- **Assignments** : Devoirs et leçons avec fichiers joints.
- **Attendance** : Suivi des présences par élève et par date.
- **Timetable** : Emploi du temps hebdomadaire par classe.
- **Messages** : Échanges internes entre les membres de la plateforme.
- **Results** : Notes des élèves par période.
- **Submissions** : Signatures numériques des parents.
- **Communications** : Communiqués et convocations.

## 🏷️ Standards de Naming (Conventions)
Pour garantir la cohérence du projet, les termes désignant le personnel enseignant suivent une règle stricte :

| Niveau | Terme utilisé | Raison |
| :--- | :--- | :--- |
| **Technique (Code/DB)** | `teacher` / `Teacher` | Standard de programmation et nom du modèle Mongoose. |
| **Structurel (Fichiers)** | `teacher.api.js` | Cohérence avec le modèle backend. |
| **Interface (Labels)** | `Enseignant` | Utilisé dans les formulaires et listes administratives. |
| **Humain (Affichage)** | `Professeur` / `Prof` | Plus lisible et naturel pour les Parents et Élèves. |

> **Note :** Il n'y a aucune différence fonctionnelle entre ces termes dans le code. Le rôle de sécurité reste toujours `teacher`.

## 🎨 Interface et UX (User Experience)
Pour garantir l'homogénéité visuelle et faciliter le travail en équipe, un document complet a été rédigé.
👉 **Consultez le fichier `docs/UI_UX_GUIDELINES.md`** pour tout savoir sur :
- L'utilisation des boutons (`.btn-primary`, `.btn-danger`, etc.).
- La structure des formulaires (`.form`).
- La gestion sécurisée des liens vers les fichiers joints (`getFileUrl`).
- Le fonctionnement des composants dynamiques (ex: choix de cible des communications).

## 📦 Gestion des Fichiers (Stockage Hybride)
Scolaris utilise un système de stockage "intelligent" qui s'adapte automatiquement à son environnement via le fichier `.env`.

### Le "Smart Switch" (Interrupteur Intelligent)
Dans le fichier `backend/src/middlewares/upload.middleware.js`, le système vérifie la présence de trois clés spécifiques :
1.  `CLOUDINARY_CLOUD_NAME` : L'identifiant de votre espace Cloud.
2.  `CLOUDINARY_API_KEY` : Votre clé d'accès.
3.  `CLOUDINARY_API_SECRET` : Votre mot de passe secret.

**Logique de fonctionnement :**
- **SI les 3 clés sont présentes** : Scolaris active le mode **Cloud**. Les fichiers sont envoyés instantanément sur les serveurs de Cloudinary. L'URL enregistrée en base de données sera de type `https://res.cloudinary.com/...`.
- **SI une clé manque ou est erronée** : Scolaris reste en mode **Local**. Les fichiers sont stockés dans le dossier `backend/uploads/`. L'URL enregistrée sera de type `/uploads/nom-du-fichier.pdf`.

### Sécurité et Confidentialité
- **Protection des clés** : Le fichier `.env` est strictement personnel. Il est listé dans le fichier `.gitignore` et ne sera **jamais** publié sur GitHub.
- **URLs Dynamiques** : Les contrôleurs de Scolaris sont programmés pour détecter automatiquement si une URL provient du Cloud ou du stockage local afin de servir le fichier correctement sans aucune intervention manuelle.

## 🛠️ Fonctionnalités Avancées (Polissage)
- **Export PDF** : Utilisation de `jspdf` et `html2canvas` pour générer des bulletins et emplois du temps certifiés.
- **Optimisation Assets** : Utilisation du format **JPG compressé (85%)** pour les images du site afin de garantir une légèreté maximale (< 150Ko par image).
- **Dashboard Parent** : Intégration de compteurs en temps réel pour le suivi des signatures de devoirs.

## ⚙️ Personnalisation (Guide Développeur)

### Réseaux Sociaux
Pour modifier les liens vers vos réseaux sociaux (Facebook, Instagram, WhatsApp, etc.) :
- **Dossier** : `frontend/src/components/`
- **Fichier** : `Footer.jsx`
- **Méthode** : Recherchez la constante `socials` dans le tableau `.map()`. Remplacez les `#` par vos liens réels dans l'attribut `href` de la balise `<a>`.

### Logos et Images
- **Dossier** : `frontend/public/assets/`
- **Fichier principal** : `image.jpg` (Utilisé pour le branding global).

## 🚀 Déploiement
- **Base de données** : MongoDB Atlas.
- **Frontend** : Vercel / Netlify.
- **Backend** : Render / Heroku / Railway.
- **Fichiers** : Stockage local dans `backend/uploads/` (Configuré pour extension vers Cloudinary/S3).
