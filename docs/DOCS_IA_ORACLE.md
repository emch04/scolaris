# 🧠 Scolaris IA v3.5 - Documentation Technique Finale

Scolaris IA est l'aboutissement du projet "BlackBox". C'est un moteur hybride alliant **surveillance locale de bas niveau** et **intelligence générative de haut niveau (Gemini 2.5 Flash)**.

---

## 🏗️ Architecture "Total Recall"
L'IA possède désormais une **mémoire à long terme** stockée en base de données (Collection `IAChat`).

### Flux de données d'une commande :
1.  **Réception** : Le message utilisateur arrive au Backend.
2.  **Contexte** : Scolaris scanne ses propres stats (élèves, réussite, santé serveur).
3.  **Shield (🛡️)** : Les noms d'élèves/écoles sont remplacés par des ID masqués.
4.  **Raisonnement** : Gemini analyse le message avec le contexte système.
5.  **Unmask** : Les vrais noms sont réinjectés dans la réponse.
6.  **Persistance** : L'échange est sauvé en base de données pour l'éternité.

---

## 🚨 Systèmes de Défense Active
Scolaris IA intègre un pont direct avec l'**IA Prédictive** :
*   **Alerte Visuelle** : Si le moniteur détecte une anomalie (RAM > 95% ou DB lente), l'Orbe de l'IA devient **Rouge** instantanément.
*   **Notification de Chat** : Un message d'alerte critique est injecté automatiquement dans la conversation pour prévenir l'administrateur.

---

## 🎨 Interface Glassmorphism Organique
L'interface a été conçue pour paraître "vivante" :
*   **L'Orbe** : Représente la conscience du système. Elle pulse et change de couleur (Cyan, Orange, Rouge).
*   **Effet Verre** : Utilise le design `Glassmorphism` intégré dans un cadre standard de la plateforme pour une cohérence parfaite.
*   **Fluidité** : Le chat défile automatiquement vers le bas avec un effet "smooth scroll".

---

## 📡 Configuration Technique
*   **Modèles** : Hybride `gemini-1.5-pro` (Cerveau principal) & `gemini-1.5-flash` (Fallback/Vitesse).
*   **Intelligence** : Le système tente d'abord d'utiliser le modèle **Pro** pour sa précision. En cas de saturation ou d'erreur, il bascule automatiquement sur **Flash** pour garantir une réponse.
*   **Bases** : Séparation stricte entre les données métier et les données de l'IA.

---

## 🛠️ Maintenance & Synchronisation des Modèles
Puisque le service IA partage la base de données avec le Backend, la synchronisation des schémas est vitale.

*   **Audit de Conformité** : Utilisez `node scripts/audit.js` pour vérifier que les modèles IA et Backend sont identiques.
*   **Synchronisation Automatique** : Utilisez `node scripts/sync-models.js` pour copier instantanément les modèles du Backend vers l'IA en adaptant les chemins d'importation.

---
*Fin de la phase de création majeure (v3.5) - Emch 2026.*
