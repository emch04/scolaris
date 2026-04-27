const mongoose = require("mongoose");

/**
 * Gestionnaire de Connexions Multi-Bases
 * - Connection Principale : Scolaris Core (Élèves, Écoles, etc.)
 * - Connection Secondaire : Scolaris Logs (Audit, BlackBox, Erreurs)
 */

const connectDB = async () => {
  try {
    // 1. Connexion à la base principale
    const mainConn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`🔥 Base Principale Connectée : ${mainConn.connection.host}`);

    // 2. Connexion à la base de logs (optionnelle ou identique par défaut)
    const logsURI = process.env.MONGODB_LOGS_URI || process.env.MONGODB_URI;
    const logConn = mongoose.createConnection(logsURI);
    
    logConn.on('connected', () => {
      console.log(`📡 Base de Logs Connectée : ${logConn.host}`);
    });

    // On attache la connexion de logs à mongoose pour l'utiliser dans les modèles
    mongoose.logConnection = logConn;

  } catch (error) {
    console.error(`❌ Erreur de connexion : ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
