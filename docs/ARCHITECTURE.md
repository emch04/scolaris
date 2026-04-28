# Architecture du Système Scolaris

## 🏰 Structure des Couches

### 1. Sécurité & Fondations
- **Encryption Service** : Moteur AES-256-CBC pour le chiffrement des données sensibles (téléphones, finances).
- **Bootstrap Service** : Auto-configuration au démarrage (création du Hero Admin, initialisation des Feature Flags).
- **Feature Guard** : Middleware contrôlant l'accès aux modules selon les réglages du Hero Admin.

### 2. Module de Finance
- **Fee Model** : Définition des tarifs par établissement.
- **Payment Model** : Enregistrement des entrées (Parents) avec lien vers le secrétaire responsable.
- **Salary Model** : Gestion des décaissements pour le personnel.
- **Cloisonnement** : Chaque secrétaire est restreint à sa propre vue de caisse.

### 3. Surveillance (La Boîte Noire)
- **ErrorBoundary (React)** : Capture les crashs fatals et envoie un rapport immédiat.
- **Log System** : Stockage persistant sur MongoDB des erreurs techniques avec métadonnées (IP, UserAgent).

### 4. Hiérarchie des Permissions
Le système utilise un système de rôles granulaires (`ROLES`) validé par le middleware `authorizeRoles`.
- **Hero Admin** : Unique utilisateur capable de contourner tous les filtres d'invisibilité.

## ⚙️ Maintenance & Intégrité
L'architecture étant distribuée (Backend + Sidecar IA), des outils de cohérence sont en place :
- **Model Sync Engine** (`scripts/sync-models.js`) : Garantit que les schémas Mongoose sont identiques entre le backend et le service IA.
- **System Auditor** (`scripts/audit.js`) : Analyse globale de la santé du code, détection d'exports manquants et validation de la synchronisation des modèles.

## 💾 Base de Données
- **Mongoose / MongoDB Atlas**
- **Architecture Partagée** : Le service IA accède aux données CORE en lecture seule pour son analyse contextuelle tout en gérant ses propres logs dans un cluster dédié.
- Utilisation intensive des **Agrégations** pour les statistiques financières et de croissance.
- **Index TTL** sur les logs pour un nettoyage automatique après 30 jours.
