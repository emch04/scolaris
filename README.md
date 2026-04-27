# Scolaris 🇨🇩🚀

**Scolaris** est la plateforme de gestion scolaire de nouvelle génération conçue pour la République Démocratique du Congo. Alliant puissance administrative et intelligence artificielle, elle permet de gérer des millions d'élèves avec une fluidité totale.

---

## 🧠 Scolaris IA : L'Oracle Stratégique (v3.5)

Au cœur de Scolaris bat une intelligence artificielle hybride, connectée à **Gemini 2.5 Flash**, capable de raisonnement contextuel et de surveillance proactive.

### Fonctionnalités Clés de l'IA :
*   **Conscience du Système** : L'IA connaît en temps réel l'effectif total, le taux de réussite national et la santé technique des serveurs.
*   **Surveillance Prédictive (24/7)** : Un moniteur passif analyse la RAM, le CPU et la latence DB pour prévenir les pannes avant qu'elles ne surviennent.
*   **Interface Organique** : Un avatar vivant ("L'Orbe") qui réagit visuellement à l'état du système.
*   **Mémoire Persistante** : Historique complet des conversations sauvegardé en base de données (MongoDB).
*   **Scolaris Shield** : Anonymisation automatique des données sensibles (élèves, écoles) avant traitement par les IA externes.

---

## 🏗️ Architecture "Hyper-Scale"

Scolaris est bâti sur une architecture **Multi-Bases de Données** pour une stabilité industrielle :

1.  **Cluster CORE (Principal)** : Gère les données vitales (Élèves, Écoles, Notes, Finances).
2.  **Cluster ORACLE (Logs & IA)** : Cluster MongoDB séparé gérant l'historique, les snapshots quotidiens et les conversations de l'IA.

*Avantage : Zéro impact sur les performances utilisateurs lors des analyses lourdes de l'IA.*

---

## 🚀 Installation & Déploiement

### Pré-requis
*   Node.js (v18+)
*   MongoDB Atlas (2 Clusters recommandés)
*   Google Gemini API Key

### Configuration `.env` (Backend)
```env
PORT=5001
MONGODB_URI=ton_lien_base_principale
MONGODB_LOGS_URI=ton_lien_base_ia_logs
JWT_SECRET=ton_secret
GEMINI_API_KEY=ta_cle_gemini
```

### Lancement Rapide
```bash
# Backend
cd backend && npm install && npm start

# Frontend
cd frontend && npm install && npm run dev
```

---

## 🛠️ Commandes Scolaris IA
| Commande | Usage |
| :--- | :--- |
| **"Statut santé"** | Diagnostic complet (Technique + Académique) |
| **"RAM base"** | Analyse précise de la mémoire DB |
| **"Rapport"** | Résumé stratégique des effectifs |
| **"Prédiction"** | Estimation de la croissance à 6 mois |
| **"Nettoie"** | Optimisation du stockage |

---
*Développé avec passion pour l'éducation en RDC par **Emch**.*
