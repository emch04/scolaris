const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: "onModel"
  },
  onModel: {
    type: String,
    required: true,
    enum: ["Teacher", "Parent", "Student"]
  },
  refreshToken: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true
  }
}, { timestamps: true });

// Index pour suppression automatique après expiration
tokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("Token", tokenSchema);