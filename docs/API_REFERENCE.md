# Référence API Scolaris 🚀

Toutes les requêtes commencent par `/api`. Les routes marquées d'un 🔒 nécessitent un Token JWT dans le header `Authorization: Bearer <token>`.

## 🔑 Authentification
- `POST /auth/login` : Connexion. Retourne un `token` et les infos `user`.
- `POST /auth/register` : Inscription d'un nouvel enseignant/admin.

## 🏫 Écoles & Classes
- `GET /schools` : Liste des écoles (Public).
- `POST /schools` 🔒: Création école (**Super Admin**).
- `GET /classrooms` 🔒: Liste des classes (**Admin/Director**).
- `POST /classrooms` 🔒: Création d'une classe (**Admin/Director**).

## 👨‍🏫 Enseignants
- `GET /teachers` 🔒: Liste des enseignants de l'école (**Admin/Director**).

## 🎓 Élèves
- `GET /students` 🔒: Liste de tous les élèves (**Admin/Director/Teacher**).
- `POST /students` 🔒: Inscription nouvel élève (**Admin/Director**).

## 👪 Parents
- `GET /parents` 🔒: Liste de tous les parents (**Admin/Director**).
- `GET /parents/:id` 🔒: Détails d'un parent et ses enfants (**Admin/Director**).
- `GET /parents/dashboard` 🔒: Espace personnel du parent (**Parent uniquement**).

## 📝 Résultats & Bulletins
- `POST /results` 🔒: Ajouter une note (**Teacher/Director**).
- `GET /results/student/:studentId` 🔒: Consulter le bulletin d'un élève.

## ✍️ Soumissions & Signatures (SMS OTP)
- `POST /submissions/request-otp` : Demander un code de sécurité par SMS.
- `POST /submissions` 🔒: Signer un bulletin avec le code OTP.
- `GET /submissions/assignment/:assignmentId` 🔒: Voir les signatures pour un devoir.

## 📢 Communications
- `GET /communications` 🔒: Liste des messages de l'école.
- `POST /communications` 🔒: Publier un message (Directeur).

---

## 🛠️ Comment tester (Postman / Curl)

### 1. Se connecter (Login)
```bash
curl -X POST http://localhost:5001/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email": "admin@scolaris.cd", "password": "superadmin123"}'
```

### 2. Accéder à une route protégée
Ajoutez le token dans l'onglet **Authorization** > **Bearer Token** de Postman.

### 👥 Comptes de test (Seed)
| Rôle | Email | Password |
| :--- | :--- | :--- |
| **Super Admin** | `admin@scolaris.cd` | `superadmin123` |
| **Directeur** | `demo@ecole.cd` | `admin123` |
| **Parent** | `parent@demo.cd` | `parent123` |
