/**
 * @file server.js
 * @description Point d'entrée du serveur backend Scolaris.
 */

require("dotenv").config();
const app = require("./app");
const connectDB = require("./src/config/db");
const runBootstrap = require("./src/utils/bootstrap");
const { startPredictiveMonitoring } = require("./src/modules/logs/predictive.monitor");

// Connexion à la base de données
connectDB().then(() => {
  console.log("🔥 Base de données connectée");
  
  // Exécution de l'auto-configuration (Hero Admin + Feature Flags)
  runBootstrap();
  
  // Démarrage de l'IA Prédictive 24/7
  startPredictiveMonitoring();
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`🚀 Serveur Scolaris lancé sur le port ${PORT}`);
});
