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
      required: true
    },
    classroom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Classroom"
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Communication", communicationSchema);
