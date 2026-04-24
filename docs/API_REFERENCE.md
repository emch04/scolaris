# Référence API Scolaris 🚀

Toutes les requêtes commencent par `/api`. 

## 🔐 Authentification & Sécurité
Scolaris utilise un système de cookies **HTTP-Only**. Vous n'avez plus besoin d'envoyer le header `Authorization` manuellement, le navigateur gère les tokens automatiquement.

- `POST /auth/login` : Connexion. Définit les cookies `token` et `refreshToken`.
- `POST /auth/logout` : Déconnexion. Efface les cookies et révoque la session.
- `POST /auth/refresh` : Renouvelle l'Access Token de manière invisible.
- `GET /auth/me` 🔒 : Récupère le profil de l'utilisateur connecté via sa session active.

## 🏫 Écoles & Classes
- `GET /schools` : Liste des écoles (Public).
- `POST /schools` 🔒 : Création école (**Super Admin**).
- `GET /classrooms` 🔒 : Liste des classes (**Admin/Director**).
- `POST /classrooms` 🔒 : Création d'une classe (**Admin/Director**).

## 🎓 Élèves & Parents
- `GET /students` 🔒 : Liste des élèves (**Admin/Director/Teacher**).
- `POST /students` 🔒 : Inscription nouvel élève (**Réservé Admin/Director**).
- `GET /parents/dashboard` 🔒 : Espace personnel du parent (Statistiques de signature).

## 📅 Emploi du Temps (Timetable)
- `GET /timetable/classroom/:classroomId` 🔒 : Consulter l'emploi du temps.
- `POST /timetable` 🔒 : Ajouter un cours (**Admin/Director/Teacher**).
- `DELETE /timetable/:id` 🔒 : Supprimer un cours.

## 📈 Statistiques
- `GET /stats/global` 🔒 : Statistiques du réseau (**Super Admin**).
- `GET /stats/teacher` 🔒 : Moyenne et réussite de classe (**Teacher**).

## 📖 Plans de Cours & Bibliothèque
- `POST /course-plans` 🔒 : Publier un programme avec fichiers joints (Cloudinary).
- `GET /resources` 🔒 : Accès aux livres et exercices numériques.

## 📝 Résultats & Bulletins
- `POST /results` 🔒 : Saisie des notes par période.
- `GET /results/student/:studentId` 🔒 : Génération du bulletin numérique.

## ✍️ Signatures Numériques
- `POST /submissions` 🔒 : Signature parentale sécurisée par code OTP.

---

## 🛠️ Comment tester (Local)

### 1. Se connecter (Login)
```bash
curl -X POST http://localhost:5001/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email": "admin@scolaris.cd", "password": "superadmin123"}'
```

### 👥 Comptes de test (après seed)
| Rôle | Identifiant | Password |
| :--- | :--- | :--- |
| **Super Admin** | `admin@scolaris.cd` | `superadmin123` |
| **Enseignant** | `prof@scolaris.cd` | `prof123` |
| **Parent** | `parent@demo.cd` | `parent123` |
