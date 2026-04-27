const mongoose = require("mongoose");

/**
 * Modèle HistorySnapshot
 * Enregistre l'état global de Scolaris pour l'analyse de tendance.
 * Stocké dans la base de LOGS.
 */
const snapshotSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now, index: true },
  metrics: {
    totalStudents: Number,
    totalSchools: Number,
    totalTeachers: Number,
    avgSuccessRate: Number,
    systemHealth: {
      cpu: Number,
      ram: Number
    }
  },
  aiObservation: String
}, { timestamps: true });

// Utilisation de la connexion dédiée aux logs
const connection = mongoose.logConnection || mongoose;
module.exports = connection.model("HistorySnapshot", snapshotSchema);
