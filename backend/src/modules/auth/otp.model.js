const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true,
    refPath: "userModel"
  },
  userModel: {
    type: String,
    required: true,
    enum: ["Teacher", "Parent", "Student"]
  },
  code: { type: String, required: true },
  type: { type: String, enum: ["signature", "reset_password"], default: "signature" },
  expiresAt: { type: Date, required: true, index: { expires: '10m' } }
});

module.exports = mongoose.model("Otp", otpSchema);