# Scolaris - Global Smart School SaaS 🚀

**Scolaris** est une plateforme SaaS (Software as a Service) moderne et complète, conçue pour transformer les établissements scolaires en "Smart Schools". C'est un écosystème numérique centralisé qui simplifie la gestion pédagogique et renforce la communication entre l'école et les familles, partout dans le monde.

---

## 🌟 Vision & Solution
Scolaris résout les défis majeurs de l'éducation moderne :
- **Digitalisation Totale** : Suppression du papier pour une gestion plus écologique et efficace.
- **Transparence & Engagement** : Les parents suivent en temps réel la progression de leurs enfants.
- **Accessibilité Mondiale** : Optimisé pour une utilisation internationale avec support PWA (Offline-First) pour les zones à connectivité limitée.
- **Intégrité Académique** : Système robuste de lutte contre la fraude et la tricherie (Matricules uniques, traçabilité des notes).

---

## 🏗️ Hiérarchie du Système
Le système repose sur une structure granulaire à 5 niveaux :
1. **Super Admin (Réseau)** : Supervision globale et gestion des licences SaaS.
2. **Directeur (Établissement)** : Contrôle total sur les classes, enseignants et rapports officiels.
3. **Enseignant (Pédagogie)** : Gestion des appels, saisie des notes et distribution des devoirs.
4. **Parent (Supervision)** : Accès exclusif aux résultats et à la messagerie de l'école.
5. **Élève (Apprentissage)** : Consultation des devoirs, ressources et calendrier.

---

## 🚀 Fonctionnalités Clés
- **Tableau de Bord Dynamique** : Statistiques en temps réel sur les performances et présences.
- **Messagerie & Chat** : Espaces de discussion sécurisés par classe et messagerie privée.
- **Gestion des Notes** : Calcul automatique des moyennes et génération de bulletins PDF.
- **Calendrier & Événements** : Planification des examens, réunions et congés scolaires.
- **Bibliothèque Numérique** : Partage de ressources pédagogiques (PDF, documents).
- **SEO & PWA** : Entièrement optimisé pour Google et installable sur mobile comme une application native.

---

## 🛠️ Stack Technique
- **Frontend** : React 18 (Vite), React-Helmet-Async, PWA-ready.
- **Backend** : Node.js (Express), MongoDB (Mongoose), Cloudinary (Assets).
- **Sécurité** : JWT Authentication, Sanitize-Middleware, CORS sécurisé.
- **Déploiement** : Vercel (Frontend), Render (Backend/MongoDB).

---

## 📍 Guide de Développement Local
Pour tester le système sur votre machine :
1. **Backend** : 
   - `npm install`
   - Configurer le `.env` (voir `.env.example`)
   - `node seed.js` (Initialise la base avec des données de test)
   - `npm run dev` (Port 5001)
2. **Frontend** :
   - `npm install`
   - `npm run dev` (Port 5173)

*Consultez `docs/LOCAL_TEST_GUIDE.md` pour obtenir les identifiants et les IDs de test.*

---

## 👨‍💻 Auteur
**Emmanouch Kongo Bola** - Visionnaire & Développeur Full-Stack du projet Scolaris.
