const mongoose = require("mongoose");

/**
 * Schéma Resource
 * Gère les supports pédagogiques numériques (livres, fiches, vidéos) de la bibliothèque.
 */
const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    enum: ["Livre", "Exercice", "Fiche de révision", "Vidéo", "Autre"],
    default: "Livre"
  },
  subject: {
    type: String,
    required: true
  },
  level: {
    type: String, // ex: "6ème Primaire", "Lycée"
    required: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "School",
    required: false // Si null, ressource globale accessible à tous
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "addedByModel"
  },
  addedByModel: {
    type: String,
    enum: ["Teacher"]
  }
}, { timestamps: true });

module.exports = mongoose.model("Resource", resourceSchema);
