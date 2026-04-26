// Import de mongoose
const mongoose = require("mongoose");
/**
 * Schéma School
 * Gère les établissements scolaires enregistrés sur la plateforme Scolaris.
 */
const schoolSchema = new mongoose.Schema(
  {
    // Nom de l'école
    name: {
      type: String,
      required: true,
      trim: true
    },
    // Code ou identifiant d'école
    code: {
      type: String,
      trim: true,
      unique: true
    },
    // Adresse physique
    address: {
      type: String,
      trim: true
    },
    // Commune
    commune: {
      type: String,
      trim: true,
      default: "Tshangu"
    },
    description: {
      type: String,
      trim: true
    },
    principalName: {
      type: String,
      trim: true
    },
    phone: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      trim: true
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending"
    },
    adminEmail: {
      type: String,
      trim: true
    },
    adminFullName: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

schoolSchema.index({ status: 1 });
schoolSchema.index({ createdAt: -1 });

// Export
module.exports = mongoose.model("School", schoolSchema);
