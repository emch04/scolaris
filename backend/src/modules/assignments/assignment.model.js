// Import de mongoose
const mongoose = require("mongoose");
// Schéma Assignment
const assignmentSchema = new mongoose.Schema(
  {
    // Titre du devoir
    title: {
      type: String,
      required: true,
      trim: true
    },
    // Description du devoir ou de la leçon
    description: {
      type: String,
      required: true,
      trim: true
    },
    // Matière concernée
    subject: {
      type: String,
      trim: true
    },
    // Date limite éventuelle
    dueDate: {
      type: Date
    },
    // Classe concernée
    classroom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Classroom",
      required: true
    },
    // Prof auteur du devoir
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true
    }
  },
  {
    timestamps: true
  }
);
// Export
module.exports = mongoose.model("Assignment", assignmentSchema);
