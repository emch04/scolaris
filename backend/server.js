// On charge les variables d'environnement depuis le fichier .env
require("dotenv").config();

// On importe l'application Express configurée dans app.js
const app = require("./app");

// On importe la fonction de connexion à MongoDB
const connectDB = require("./src/config/db");

// On récupère le port depuis les variables d'environnement
const PORT = process.env.PORT || 5000;

// On lance une fonction asynchrone immédiatement
(async () => {
  try {
    // Vérification des variables d'environnement cruciales
    if (!process.env.JWT_SECRET) {
      throw new Error("La variable JWT_SECRET est manquante dans le fichier .env");
    }

    // On se connecte d'abord à la base de données
    await connectDB();

    // Une fois MongoDB connecté, on démarre le serveur HTTP
    app.listen(PORT, () => {
      // Message console pour confirmer que le serveur fonctionne
      console.log(`Serveur lancé sur le port ${PORT}`);
    });
  } catch (error) {
    // Si une erreur survient au démarrage, on l'affiche
    console.error("Erreur au démarrage du serveur :", error.message);

    // On arrête le processus car l'application ne peut pas continuer proprement
    process.exit(1);
  }
})();
