/**
 * @module Assignments/Model
 * @description Modèle Mongoose représentant un devoir ou une leçon assigné à une classe.
 */

const mongoose = require("mongoose");

/**
 * Schéma Assignment (Devoir/Leçon)
 * @typedef {Object} Assignment
 * @property {string} title - Titre du devoir
 * @property {string} description - Description détaillée du contenu
 * @property {string} [subject] - Matière concernée
 * @property {string} [fileUrl] - URL du fichier joint (leçon ou énoncé)
 * @property {Date} [dueDate] - Date limite de rendu
 * @property {mongoose.Schema.Types.ObjectId} classroom - Référence vers la classe concernée
 * @property {mongoose.Schema.Types.ObjectId} teacher - Référence vers l'enseignant auteur
 */
const assignmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    subject: {
      type: String,
      trim: true
    },
    fileUrl: {
      type: String
    },
    dueDate: {
      type: Date
    },
    classroom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Classroom",
      required: true
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true
    }
  },
  {
    timestamps: true
  }
);

assignmentSchema.index({ classroom: 1 });
assignmentSchema.index({ teacher: 1 });

module.exports = mongoose.model("Assignment", assignmentSchema);
