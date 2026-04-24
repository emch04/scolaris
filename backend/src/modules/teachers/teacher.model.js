// On importe mongoose
const mongoose = require("mongoose");
// On importe les rôles autorisés
const ROLES = require("../../constants/roles");
// Création du schéma Teacher
const teacherSchema = new mongoose.Schema(
  {
    // Nom complet de l'enseignant
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    // Email unique pour connexion
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    // Mot de passe hashé
    password: {
      type: String,
      required: true
    },
    // Téléphone facultatif
    phone: {
      type: String,
      trim: true
    },
    // Rôle utilisateur
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.TEACHER
    },
    // Statut du compte (pour validation admin)
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "approved"
    },
    // Référence vers une école
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School"
    }
  },
  {
    // Ajoute createdAt et updatedAt
    timestamps: true
  }
);
// Export du modèle
module.exports = mongoose.model("Teacher", teacherSchema);
