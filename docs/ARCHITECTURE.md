# Architecture de Scolaris 🏗️

**Date de création officielle :** Jeudi 22 avril 2026

Ce document décrit la structure technique de la plateforme Scolaris.

## 🧱 Architecture Globale
Scolaris repose sur une architecture **MERN** (MongoDB, Express, React, Node.js) améliorée par une couche de cache :

1.  **Backend (API REST)** : Gère la logique métier, la sécurité par cookies et la base de données.
2.  **Frontend (SPA)** : Interface utilisateur réactive construite avec React et Vite. Utilisation de la Context API pour la gestion de l'état global (**Auth**, **Theme**, **Toasts**).
3.  **Cache (Redis/Memory)** : Une couche de mise en cache hybride pour optimiser les performances des requêtes gourmandes.

## 🔐 Système de Sécurité
- **Authentification par Cookies** : Scolaris n'utilise plus le `localStorage` pour les tokens. Le JWT est stocké dans un cookie **HTTP-Only**, **Secure** et **SameSite**, éliminant les risques de vol de session via des scripts malveillants.
- **Refresh Token Strategy** : 
  - **Access Token** : Courte durée (15 min) pour limiter l'exposition.
  - **Refresh Token** : Longue durée (30 jours), stocké en base de données et dans un cookie séparé, permettant de renouveler la session automatiquement sans re-saisie du mot de passe.
- **Déconnexion Centralisée** : Le `logout` efface les cookies côté serveur et supprime le refresh token de la base de données.

## 📱 Progressive Web App (PWA)
Scolaris est une PWA complète qui offre une expérience proche d'une application native :
- **Service Worker** : Géré via `vite-plugin-pwa` avec des stratégies hybrides :
  - **CacheFirst** : Pour les ressources statiques et médias (images, polices).
  - **Stale-While-Revalidate** : Pour les données API, permettant une fluidité instantanée même avec un réseau lent.
- **Background Sync** : Mise en file d'attente des actions utilisateur effectuées hors-ligne pour exécution automatique dès le retour du réseau.
- **Periodic Sync** : Rafraîchissement automatique des données critiques (horaires, messages) toutes les 12 heures en arrière-plan.
- **Mode Hors-ligne** : L'application met en cache les fichiers statiques et les réponses API critiques (Emploi du temps, Devoirs récents). L'utilisateur peut consulter ses données même en zone blanche.

## ⚡ Performances et Optimisations
Scolaris a été conçu pour une fluidité maximale, même sur des réseaux limités :
- **Vitesse d'affichage (LCP)** : ~0,20 s (Chargement quasi instantané).
- **Stabilité visuelle (CLS)** : 0 (Aucun décalage de mise en page).
- **Réactivité (INP)** : ~16-48 ms (Réponse aux clics instantanée).

### Stratégies d'optimisation :
1.  **Système de Cache Hybride** : Le backend utilise un service de cache (`cache.service.js`) qui tente de se connecter à une instance **Redis**. En cas d'indisponibilité, il bascule automatiquement sur une gestion en mémoire vive (Map JS) avec expiration (TTL). Ce cache est utilisé pour les statistiques et les rapports.
2.  **Pagination des données** : Pour les collections volumineuses (comme les élèves), l'API utilise une pagination côté serveur (`skip`, `limit`) pour réduire le temps de réponse et la consommation de bande passante.
3.  **Vite & CSS Pur** : Utilisation de **Vite** pour un build ultra-performant et absence de frameworks CSS lourds.

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
| Niveau | Terme utilisé | Raison |
| :--- | :--- | :--- |
| **Technique (Code/DB)** | `teacher` / `Teacher` | Standard de programmation et nom du modèle Mongoose. |
| **Structurel (Fichiers)** | `teacher.api.js` | Cohérence avec le modèle backend. |
| **Interface (Labels)** | `Enseignant` | Utilisé dans les formulaires et listes administratives. |
| **Humain (Affichage)** | `Professeur` / `Prof` | Plus lisible et naturel pour les Parents et Élèves. |

## 📦 Gestion des Fichiers (Stockage Hybride)
Scolaris utilise un système de stockage "intelligent" (Cloudinary ou Local) qui s'adapte automatiquement via les variables d'environnement.

## 🚀 Déploiement
- **Base de données** : MongoDB Atlas.
- **Frontend** : Vercel / Netlify.
- **Backend** : Render / Heroku / Railway.
- **Cache** : Redis Cloud ou instance locale.
