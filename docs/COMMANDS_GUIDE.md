# 📘 Guide des Commandes Scolaris (Cheat Sheet)

Ce guide contient toutes les commandes nécessaires pour gérer ton serveur Oracle Cloud et ton projet en local.

## 💻 Sur ton MacBook (Local)
| Action | Commande |
| :--- | :--- |
| **Envoyer le projet** | `./deploy_now.sh` |
| **Se connecter au serveur** | `ssh -i oracle_key.key ubuntu@130.61.178.59` |
| **Sauvegarder sur GitHub** | `git add . && git commit -m "Update" && git push` |

## ☁️ Sur le serveur Oracle (SSH)
| Action | Commande |
| :--- | :--- |
| **Installation / Mise à jour** | `./setup_oracle.sh` |
| **Voir si tout tourne** | `sudo docker ps` |
| **Voir les erreurs (Logs)** | `sudo docker-compose logs -f --tail 50` |
| **Redémarrer proprement** | `sudo docker-compose up -d --build` |
| **Nettoyage complet (SSL/Fix)** | `sudo docker-compose down --rmi all && ./setup_oracle.sh` |
| **Modifier la config** | `nano .env` |

## 🔐 Identifiants par défaut
- **Admin Principal** : `admin@scolaris.cd` / `password123`
- **Admin Perso** : `emchkongo@gmail.com` / `2004emch`

## 🛠️ Dépannage rapide
- **Erreur 500 ?** Vérifie si MongoDB Atlas a autorisé l'IP `130.61.178.59`.
- **Site inaccessible ?** Vérifie que le port 80 est ouvert dans la console Oracle.
- **IA en rouge ?** Vérifie ta `GEMINI_API_KEY` dans le `.env`.
