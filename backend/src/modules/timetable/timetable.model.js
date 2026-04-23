const mongoose = require("mongoose");

const timetableSchema = new mongoose.Schema({
  classroom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Classroom",
    required: true
  },
  day: {
    type: String,
    enum: ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"],
    required: true
  },
  startTime: {
    type: String, // Format "08:00"
    required: true
  },
  endTime: {
    type: String, // Format "10:00"
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher"
  }
}, { timestamps: true });

module.exports = mongoose.model("Timetable", timetableSchema);
