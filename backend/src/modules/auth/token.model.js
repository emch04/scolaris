/**
 * @module Auth/TokenModel
 * @description Modèle Mongoose pour le stockage des Refresh Tokens.
 */

const mongoose = require("mongoose");

/**
 * Schéma Token pour les sessions utilisateurs
 * @typedef {Object} Token
 * @property {mongoose.Schema.Types.ObjectId} userId - Référence à l'utilisateur (Enseignant, Parent ou Élève)
 * @property {string} onModel - Type de modèle utilisateur référencé (Enum: Teacher, Parent, Student)
 * @property {string} refreshToken - Le token de rafraîchissement
 * @property {Date} expiresAt - Date d'expiration du token
 */
const tokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: "onModel"
  },
  onModel: {
    type: String,
    required: true,
    enum: ["Teacher", "Parent", "Student"]
  },
  refreshToken: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true
  }
}, { timestamps: true });

// Index pour suppression automatique après expiration
tokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("Token", tokenSchema);