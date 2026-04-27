const mongoose = require("mongoose");

/**
 * Modèle IAChat
 * Stocke les échanges entre l'utilisateur et Scolaris IA.
 * Stocké dans la base de LOGS.
 */
const chatSchema = new mongoose.Schema({
  user: { type: String, default: "Hero Admin" },
  command: { type: String, required: true },
  response: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

// Utilisation de la connexion dédiée aux logs
const connection = mongoose.logConnection || mongoose;
module.exports = connection.model("IAChat", chatSchema);
