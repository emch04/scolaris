# Checklist de Sécurité Scolaris

A effectuer lors de chaque intervention de maintenance :

## 1. Audit des Dépendances
- Exécuter `npm audit` dans `backend/` et `frontend/`.
- Appliquer les correctifs avec `npm audit fix` si nécessaire.

## 2. Validation du Runtime
- Vérifier que le `JWT_SECRET` est présent dans le `.env`.
- Vérifier que `Helmet` et `RateLimit` sont actifs dans `app.js`.

## 3. Nettoyage
- Supprimer les fichiers de logs volumineux (`*.log`).
- Vérifier qu'aucun fichier sensible (ex: `.env`) n'est tracké par Git.

## 4. Tests de Connexion
- Tester l'endpoint `/api/auth/login`.
- Vérifier la connexion à MongoDB.
