// On importe mongoose pour se connecter à MongoDB
const mongoose = require("mongoose");

// Fonction asynchrone de connexion à la base
const connectDB = async () => {
  // On récupère l'URL MongoDB depuis les variables d'environnement
  const mongoURI = process.env.MONGODB_URI;

  // Si l'URL n'existe pas, on stoppe tout avec une erreur claire
  if (!mongoURI) {
    throw new Error("La variable MONGODB_URI est manquante.");
  }

  // Tentative de connexion à MongoDB
  await mongoose.connect(mongoURI);

  // Message de confirmation
  console.log("MongoDB connecté avec succès");
};

// On exporte la fonction
module.exports = connectDB;
