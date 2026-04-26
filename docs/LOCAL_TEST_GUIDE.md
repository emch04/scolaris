push# 📍 Guide des Tests Locaux - Scolaris

Ce document contient tous les identifiants et IDs générés pour les tests en environnement local.

## 🔐 Identifiants de Connexion (Login)

| Profil | Email | Mot de passe | Rôle |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@scolaris.cd` | `password123` | Gestion Réseau |
| **Directeur** | `demo@ecole.cd` | `password123` | Gestion École |
| **Parent** | `parent@demo.cd` | `password123` | Suivi Enfant |
| **Élève** | `student@demo.cd` | `password123` | Espace Élève |

---

## 🏗️ Structure de l'Établissement (IDs)

- **École (Tshangu)** : `69ed3f87c6cdfe6d6044dbed`
- **Classe (6ème A)** : `69ed3f87c6cdfe6d6044dbf1`

---

## 👥 Utilisateurs (IDs)

- **Super Admin** : `69ed3f87c6cdfe6d6044dbeb`
- **Directeur Jean** : `69ed3f87c6cdfe6d6044dbef`
- **Emma Kongo Jr (Élève)** : `69ed3f87c6cdfe6d6044dbf3`
- **M. Kongo Senior (Parent)** : `69ed3f87c6cdfe6d6044dbf5`

---

## 📅 Données de Test (IDs)

### Calendrier & Événements
- **Journée Portes Ouvertes** : `69ed4112c6cdfe6d6044dbfb`
- **Examen Final** : `69ed41f6c6cdfe6d6044dc21`

### Devoirs (Assignments)
- **Le Petit Prince** : `69ed4112c6cdfe6d6044dc01`
- **Géométrie** : `69ed4112c6cdfe6d6044dbff`
- **Anglais/Géo** : `69ed41f6c6cdfe6d6044dc1b`

### Communications & Messages
- **Réunion de parents** : `69ed4112c6cdfe6d6044dc03`
- **Message Parent -> Directeur** : `69ed41f6c6cdfe6d6044dc29`

---

## 💡 Notes pour les tests
- Pour tester le **Tableau de Bord Parent**, connectez-vous avec `parent@demo.cd`. Vous verrez automatiquement les notes de `Emma Kongo Jr`.
- Pour tester le **Chat de classe**, connectez-vous avec le Directeur ou l'Élève et allez dans la classe `6ème A`.
- Les graphiques de statistiques (moyennes, taux de réussite) sont calculés à partir des résultats de l'élève `69ed3f87c6cdfe6d6044dbf3`.
