/**
 * @module Classrooms/Model
 * @description Modèle Mongoose représentant une salle de classe dans une école.
 */

const mongoose = require("mongoose");

/**
 * Schéma Classroom (Salle de classe)
 * @typedef {Object} Classroom
 * @property {string} name - Nom de la classe (ex: 6ème A)
 * @property {string} level - Niveau scolaire (ex: Primaire, Secondaire)
 * @property {mongoose.Schema.Types.ObjectId} school - Référence vers l'école d'appartenance
 * @property {mongoose.Schema.Types.ObjectId} [titularTeacher] - Référence vers l'enseignant titulaire de la classe
 */
const classroomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    level: {
      type: String,
      required: true,
      trim: true
    },
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true
    },
    titularTeacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Classroom", classroomSchema);
