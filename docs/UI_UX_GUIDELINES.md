# Architecture UI/UX et Composants Scolaris 🎨

Ce document détaille les conventions d'interface utilisateur (UI) et d'expérience utilisateur (UX) que nous avons mises en place pour Scolaris. Son but est de garantir une cohérence visuelle et fonctionnelle si d'autres développeurs rejoignent le projet.

## 1. Philosophie Générale (Le "Look & Feel")
Scolaris adopte un design "Glassmorphism" moderne avec des effets de transparence, des arrière-plans sombres avec des dégradés subtils, et des éléments d'interface qui semblent flotter (`backdrop-filter`).
- **Accessibilité :** Les contrastes doivent être élevés. Le texte sur les fonds colorés doit toujours être blanc ou très clair.
- **Formulaires :** Tous les champs de saisie (inputs, textareas, selects) ont un fond blanc ou très clair avec un texte sombre pour garantir la lisibilité, encapsulés dans des conteneurs sombres.

## 2. Le Système de Boutons (`.btn`)
Tous les boutons de l'application utilisent la classe de base `.btn` définie dans `frontend/src/styles/globals.css`.

### A. Les Variantes de Boutons
Il existe 3 variantes principales de boutons, chacune ayant un usage sémantique précis :

*   **`.btn-primary` (Bleu Scolaris)** :
    *   *Usage :* Action principale d'une page (Soumettre un formulaire, Se connecter, Créer un devoir, Envoyer un message).
    *   *Comportement :* C'est le bouton par défaut qui attire l'œil de l'utilisateur pour l'action attendue.
*   **`.btn-success` (Vert)** :
    *   *Usage :* Validation positive, approbation, actions de confirmation irréversibles ou positives (ex: "Approuver une école" par le Super Admin).
*   **`.btn-danger` (Rouge)** :
    *   *Usage :* Actions destructrices ou négatives (Supprimer une ressource, Rejeter une demande, Révoquer l'accès d'un enseignant, Bouton "Annuler" lors de la création d'un message).

### B. Boutons d'Action (Cartes / Tableaux)
Pour les actions secondaires dans les cartes (comme dans le Dashboard Parent), nous utilisons des boutons avec des fonds semi-transparents assortis à la couleur de l'action :
*   *Exemple :* `background: rgba(52, 168, 83, 0.1)` avec un texte/bordure vert (`#34A853`) pour le bouton "Notes".
*   *Pourquoi ?* Cela permet de distinguer ces actions rapides des boutons principaux (qui sont pleins) tout en gardant un code couleur sémantique.

## 3. Formulaires (`.form`)
Tous les formulaires importants (connexion, ajout de ressource, publication de devoir) doivent utiliser la classe `.form`.
*   *Styling :* Elle applique un fond transparent (`rgba(255, 255, 255, 0.05)`), des bordures douces, et gère l'espacement (`gap`) entre les champs de manière uniforme.
*   *Inputs :* Les balises `input`, `select`, et `textarea` reçoivent un fond clair (`rgba(255, 255, 255, 0.9)`) et un texte sombre (`#222`) globalement via `globals.css` pour éviter de répéter les styles inline.

## 4. Liens et Redirections
*   **Redirections standard (`<Link>` de React Router)** : Utilisées pour la navigation interne. Les liens "Tout voir →" utilisent souvent la couleur primaire et une flèche pour indiquer qu'ils mènent à une liste complète.
*   **Fichiers Joints (`<a href="...">`)** :
    *   *Outil Critique :* TOUS les liens vers des fichiers téléchargés (PDF, images) DOIVENT utiliser l'utilitaire `getFileUrl(path)` situé dans `frontend/src/utils/fileUrl.js`.
    *   *Pourquoi ?* Cet utilitaire garantit que le lien pointe toujours vers le bon serveur (le `localhost` en développement, ou l'URL Render/Vercel en production) sans causer d'erreur 404.
    *   *UI :* Les boutons de téléchargement ou d'ouverture de fichier intègrent souvent une icône "Télécharger" ou "Ouvrir externe" pour indiquer à l'utilisateur qu'il va quitter la page courante ou télécharger un document.

## 5. Icônes (SVG)
L'application n'utilise pas de bibliothèque d'icônes externe lourde (comme FontAwesome).
*   *Choix technique :* Nous utilisons des SVG inline (souvent issus de Feather Icons) pour des performances optimales.
*   *Règle d'usage :* Une icône doit toujours accompagner une action importante (ex: une corbeille pour supprimer, un calendrier pour l'horaire) pour améliorer la reconnaissance visuelle (UX).

## 6. Composants Spécifiques

### Le Bouton OTP / Signature (Dashboard Parent)
*   **UX :** Ce processus est divisé en deux étapes pour plus de sécurité (Demande de code -> Saisie du code).
*   **UI :** Le champ de saisie du code OTP est très large, centré, avec un espacement (`letter-spacing`) important pour imiter les interfaces bancaires et donner un sentiment de sécurité.

### Choix de la Cible (Communications)
*   **UX :** L'interface s'adapte dynamiquement. Les administrateurs voient des "Boutons Radio" pour choisir le *type* de cible (Classe, Élève, Prof). La sélection d'un type affiche ensuite les listes déroulantes (`<select>`) appropriées.
*   **Sécurité Frontend :** Les listes (ex: liste des élèves) sont filtrées côté frontend (ex: on ne montre que les élèves de la classe sélectionnée) pour éviter les erreurs d'envoi.

## 7. Gestion des Erreurs et Sécurité (AuthContext)
*   **Toasts (`useToast`) :** Les retours d'actions (succès ou erreur) doivent toujours utiliser le contexte Toast pour s'afficher en bas de l'écran, sans bloquer la navigation.
*   **Inactivité :** Un "Listener" d'événements étendus (clic, clavier, molette) tourne en arrière-plan. S'il n'y a aucune activité pendant 15 minutes, l'utilisateur est déconnecté. C'est une obligation sécuritaire pour le milieu scolaire.