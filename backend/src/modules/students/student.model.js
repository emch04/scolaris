// Import de mongoose
const mongoose = require("mongoose");
// Schéma Student
const studentSchema = new mongoose.Schema(
  {
    // Matricule unique
    matricule: {
      type: String,
      required: true,
      unique: true
    },
    // Nom complet
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    // Sexe de l'élève
    gender: {
      type: String,
      enum: ["M", "F"]
    },
    // Date de naissance
    birthDate: {
      type: Date
    },
    // Nom du parent ou tuteur
    parentName: {
      type: String,
      trim: true
    },
    // Téléphone du parent
    parentPhone: {
      type: String,
      trim: true
    },
    // Référence vers une école
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true
    },
    // Référence vers une classe
    classroom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Classroom",
      required: true
    },
    password: {
      type: String,
      default: "scolaris123" // Mot de passe par défaut
    },
    role: {
      type: String,
      default: "student"
    }
  },
  {
    timestamps: true
  }
);
// Export
module.exports = mongoose.model("Student", studentSchema);
