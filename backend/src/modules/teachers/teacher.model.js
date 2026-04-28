/**
 * @file teacher.model.js
 * @description Modèle de données pour les enseignants du réseau Scolaris.
 */
const mongoose = require("mongoose");
const ROLES = require("../../constants/roles");
const { encrypt, decrypt } = require("../../utils/encryption");

const teacherSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { 
      type: String,
      set: v => encrypt(v), // Chiffre avant sauvegarde
      get: v => decrypt(v)  // Déchiffre après lecture
    },
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.TEACHER
    },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    school: { type: mongoose.Schema.Types.ObjectId, ref: "School" }
  },
  { timestamps: true, toJSON: { getters: true }, toObject: { getters: true } }
);

module.exports = mongoose.model("Teacher", teacherSchema);
