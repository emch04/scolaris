# Référence de l'API Scolaris

## 🔐 Authentification
- `POST /api/auth/register` : Inscription d'une école.
- `POST /api/auth/login` : Connexion (JWT).
- `POST /api/auth/logout` : Déconnexion.

## 💰 Finance & Trésorerie
- `GET /api/finance/treasury` : Statistiques de caisse.
- `GET /api/finance/payments` : Historique des encaissements.
- `POST /api/finance/fees` : Création d'un type de frais.
- `POST /api/finance/payments` : Enregistrement d'un versement parent.

## ⚙️ Administration Suprême (Hero Admin)
- `GET /api/logs` : Liste des crashs système.
- `DELETE /api/logs/clear` : Vidage du journal.
- `GET /api/system-config` : État des interrupteurs système.
- `PATCH /api/system-config/:key` : Activer/Désactiver un module ou un rôle.

## 📈 Statistiques
- `GET /api/stats/global` : Statistiques réseau sur 12 mois.
- `GET /api/stats/teacher` : Statistiques d'établissement sur 12 mois.
