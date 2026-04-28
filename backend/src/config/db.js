const mongoose = require("mongoose");

/**
 * Gestionnaire de Connexions Multi-Bases Fortifié
 * Optimisé pour Render et MongoDB Atlas (TLS/SSL)
 */

const connectDB = async () => {
  const options = {
    serverSelectionTimeoutMS: 5000,
    autoIndex: true,
    // Options de sécurité renforcées pour éviter les alertes TLS
    tls: true,
    retryWrites: true,
    w: "majority"
  };

  try {
    // 1. Connexion à la base principale
    const mainConn = await mongoose.connect(process.env.MONGODB_URI, options);
    console.log(`🔥 Base Principale Connectée : ${mainConn.connection.host}`);

    // 2. Connexion à la base de logs (Scolaris Logs)
    const logsURI = process.env.MONGODB_LOGS_URI || process.env.MONGODB_URI;
    const logConn = mongoose.createConnection(logsURI, options);
    
    logConn.on('connected', () => {
      console.log(`📡 Base de Logs Connectée : ${logConn.host}`);
    });

    logConn.on('error', (err) => {
      console.error(`❌ Erreur Base de Logs : ${err.message}`);
    });

    // On attache la connexion de logs à mongoose
    mongoose.logConnection = logConn;

  } catch (error) {
    console.error(`❌ ERREUR CRITIQUE CONNEXION DB : ${error.message}`);
    // En cas d'erreur TLS sur Render, on affiche un conseil
    if (error.message.includes('TLS')) {
      console.error("👉 CONSEIL : Vérifiez que NODE_VERSION est au moins 18+ sur Render.");
    }
    process.exit(1);
  }
};

module.exports = connectDB;
