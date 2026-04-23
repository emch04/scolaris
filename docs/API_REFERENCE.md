# Référence API Scolaris 🚀

Toutes les requêtes commencent par `/api`.

## 🔑 Authentification
- `POST /auth/login` : Connexion (Staff & Parents).
- `POST /auth/register` : Inscription staff (Admin).

## 🏫 Écoles & Classes
- `GET /schools` : Liste des écoles.
- `POST /schools` : Création école (Admin uniquement).
- `GET /classrooms` : Liste des classes.

## 🎓 Élèves
- `GET /students` : Liste de tous les élèves.
- `POST /students` : Inscription nouvel élève.

## 📝 Résultats & Bulletins
- `POST /results` : Ajouter une note.
- `GET /results/student/:studentId` : Récupérer toutes les notes d'un élève.

## ✍️ Soumissions & Signatures
- `POST /submissions/request-otp` : Demander un code de sécurité SMS.
- `POST /submissions` : Envoyer la signature (avec le code OTP).
- `GET /submissions/assignment/:assignmentId` : Voir les signatures pour un devoir.

## 📢 Communications
- `GET /communications` : Liste des messages.
- `POST /communications` : Publier un message avec fichier joint.
