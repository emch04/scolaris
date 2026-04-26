const mongoose = require("mongoose");

/**
 * Schéma Result
 * Gère les notes et évaluations académiques des élèves par matière et par période.
 */
const resultSchema = new mongoose.Schema({
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true
    },
    subject: {
      type: String,
      required: true,
      trim: true
    },
    score: {
      type: Number,
      required: true
    },
    maxScore: {
      type: Number,
      default: 20
    },
    appreciation: {
      type: String,
      trim: true
    },
    period: {
      type: String,
      enum: ["Trimestre 1", "Trimestre 2", "Trimestre 3", "Examen État"],
      required: true
    },
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

resultSchema.index({ student: 1 });
resultSchema.index({ teacher: 1 });

module.exports = mongoose.model("Result", resultSchema);
