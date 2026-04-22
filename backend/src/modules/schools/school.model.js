// Import de mongoose
const mongoose = require("mongoose");
// Schéma School
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
    }
  },
  {
    timestamps: true
  }
);
// Export
module.exports = mongoose.model("School", schoolSchema);
