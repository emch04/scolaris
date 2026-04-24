const mongoose = require("mongoose");

const communicationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    content: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: ["communique", "convocation"],
      required: true
    },
    fileUrl: {
      type: String
    },
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: false // Null signifie global (Réseau)
    },
    classroom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Classroom"
    },
    targetStudent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: false
    },
    targetTeacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: false
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "authorModel",
      required: true
    },
    authorModel: {
      type: String,
      required: true,
      enum: ["Teacher"]
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Communication", communicationSchema);
