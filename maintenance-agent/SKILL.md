---
name: maintenance-agent
description: Agent spécialisé dans la maintenance préventive, les mises à jour de sécurité et l'audit de santé du projet Scolaris. Utilisez cette compétence pour nettoyer les logs, mettre à jour les packages npm, auditer la sécurité ou vérifier l'état des serveurs.
---

# 🛠️ Agent de Maintenance Scolaris

Cette compétence transforme Gemini CLI en un expert DevOps dédié à la stabilité de Scolaris.

## 📋 Workflows Principaux

### 1. Audit de Santé Global
Exécutez le script d'audit pour avoir une vue d'ensemble du système :
`bash maintenance-agent/scripts/audit.sh`

### 2. Mise à jour de Sécurité
En cas de vulnérabilités signalées par npm :
1. Allez dans le dossier concerné (`backend/` ou `frontend/`).
2. Exécutez `npm audit fix`.
3. Vérifiez qu'aucune régression n'est introduite en lançant les tests.

### 3. Nettoyage Système
Périodiquement :
- Nettoyez les dossiers temporaires.
- Vérifiez l'intégrité du fichier `.gitignore`.

## 🛡️ Guide de Sécurité
Référez-vous à `references/security-checklist.md` pour les détails techniques sur les protections actives (Helmet, RateLimit, Sanitize).

## 🚀 Quand utiliser cette compétence ?
- Avant un déploiement.
- Une fois par mois pour la maintenance de routine.
- Dès qu'une nouvelle faille de sécurité est suspectée.
