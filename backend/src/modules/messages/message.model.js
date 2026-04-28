/**
 * @file message.model.js
 * @description Schéma de données pour les messages échangés dans Scolaris.
 */
const mongoose = require("mongoose");

/**
 * Schéma Message
 * Gère les communications privées entre utilisateurs et les discussions de groupe par classe.
 */
const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "senderModel",
    required: true
  },
  senderModel: {
    type: String,
    required: true,
    enum: ["Teacher", "Parent", "Student"]
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "recipientModel",
    required: false // Optionnel pour le chat de groupe
  },
  recipientModel: {
    type: String,
    required: false, // Optionnel pour le chat de groupe
    enum: ["Teacher", "Parent", "Student"]
  },
  classroom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Classroom",
    required: false // Présent uniquement si message de groupe
  },
  content: {
    type: String,
    required: true
  },
  read: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

messageSchema.index({ recipient: 1 });
messageSchema.index({ classroom: 1 });

module.exports = mongoose.model("Message", messageSchema);
