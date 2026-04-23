const mongoose = require("mongoose");

const calendarSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true
  },
  type: {
    type: String,
    enum: ["Événement", "Congé", "Examen", "Réunion", "Autre"],
    default: "Événement"
  },
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "School",
    required: false // Si null, événement national/global
  }
}, { timestamps: true });

module.exports = mongoose.model("Calendar", calendarSchema);
