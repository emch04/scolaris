/**
 * @module Attendance/Model
 * @description Modèle Mongoose représentant les relevés de présence des élèves.
 */

const mongoose = require("mongoose");

/**
 * Schéma Attendance (Présence)
 * @typedef {Object} Attendance
 * @property {mongoose.Schema.Types.ObjectId} student - Référence vers l'élève
 * @property {mongoose.Schema.Types.ObjectId} classroom - Référence vers la classe
 * @property {mongoose.Schema.Types.ObjectId} teacher - Référence vers l'enseignant ayant fait l'appel
 * @property {Date} date - Date de l'appel
 * @property {string} status - État de présence (present, absent, late)
 * @property {string} [reason] - Motif de l'absence ou du retard
 */
const attendanceSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true
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
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  status: {
    type: String,
    enum: ["present", "absent", "late"],
    default: "present"
  },
  reason: {
    type: String,
    default: ""
  }
}, { timestamps: true });

module.exports = mongoose.model("Attendance", attendanceSchema);
