/**
 * @module Auth/OtpModel
 * @description Modèle Mongoose pour la gestion des codes de validation à usage unique (OTP).
 */

const mongoose = require("mongoose");

/**
 * Schéma OTP (One-Time Password)
 * @typedef {Object} Otp
 * @property {mongoose.Schema.Types.ObjectId} userId - Référence à l'utilisateur (Enseignant, Parent ou Élève)
 * @property {string} userModel - Type de modèle utilisateur référencé (Enum: Teacher, Parent, Student)
 * @property {string} code - Le code de validation généré
 * @property {string} type - Le but du code (Enum: signature, reset_password)
 * @property {Date} expiresAt - Date d'expiration du code (TTL de 10 minutes)
 */
const otpSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true,
    refPath: "userModel"
  },
  userModel: {
    type: String,
    required: true,
    enum: ["Teacher", "Parent", "Student"]
  },
  code: { type: String, required: true },
  type: { type: String, enum: ["signature", "reset_password"], default: "signature" },
  expiresAt: { type: Date, required: true, index: { expires: '10m' } }
});

module.exports = mongoose.model("Otp", otpSchema);