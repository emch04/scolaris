const mongoose = require("mongoose");

const coursePlanSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true
  },
  classroom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Classroom",
    required: true
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
    required: true
  },
  year: {
    type: String, // ex: "2023-2024"
    required: true
  },
  content: {
    type: String, // Peut être du texte riche ou une description
    required: true
  },
  fileUrl: {
    type: String // Optionnel : document PDF du plan
  }
}, { timestamps: true });

module.exports = mongoose.model("CoursePlan", coursePlanSchema);
