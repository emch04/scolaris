// Import de mongoose
const mongoose = require("mongoose");
// Schéma Classroom
const classroomSchema = new mongoose.Schema(
  {
    // Nom de la classe
    name: {
      type: String,
      required: true,
      trim: true
    },
    // Niveau scolaire
    level: {
      type: String,
      required: true,
      trim: true
    },
    // Référence vers l'école
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true
    },
    // Référence vers le titulaire de la classe
    titularTeacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher"
    }
  },
  {
    timestamps: true
  }
);
// Export
module.exports = mongoose.model("Classroom", classroomSchema);
