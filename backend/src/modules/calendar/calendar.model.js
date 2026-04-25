/**
 * @module Calendar/Model
 * @description Modèle Mongoose représentant un événement dans le calendrier scolaire.
 */

const mongoose = require("mongoose");

/**
 * Schéma Calendar (Calendrier)
 * @typedef {Object} Calendar
 * @property {string} title - Titre de l'événement
 * @property {Date} date - Date de l'événement
 * @property {string} type - Type d'événement (Événement, Congé, Examen, Réunion, Autre)
 * @property {mongoose.Schema.Types.ObjectId} [school] - Référence vers l'école (null si global)
 */
const calendarSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true
  },
  type: {
    type: String,
    enum: ["Événement", "Congé", "Examen", "Réunion", "Autre"],
    default: "Événement"
  },
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "School",
    required: false
  }
}, { timestamps: true });

module.exports = mongoose.model("Calendar", calendarSchema);
