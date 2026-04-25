const mongoose = require("mongoose");
const ROLES = require("../../constants/roles");

/**
 * Schéma Parent
 * Gère les comptes des parents d'élèves et leurs liens avec les étudiants.
 */
const parentSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      trim: true
    },
    role: {
      type: String,
      default: ROLES.PARENT
    },
    // Liste des enfants (élèves) suivis par ce parent
    children: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student"
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Parent", parentSchema);