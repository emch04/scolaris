const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "senderModel",
    required: true
  },
  senderModel: {
    type: String,
    required: true,
    enum: ["Teacher", "Parent", "Student", "Admin"]
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "recipientModel",
    required: false // Optionnel pour le chat de groupe
  },
  recipientModel: {
    type: String,
    required: false, // Optionnel pour le chat de groupe
    enum: ["Teacher", "Parent", "Student", "Admin"]
  },
  classroom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Classroom",
    required: false // Présent uniquement si message de groupe
  },
  content: {
    type: String,
    required: true
  },
  read: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model("Message", messageSchema);
