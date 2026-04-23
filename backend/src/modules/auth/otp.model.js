const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: "Parent", required: true },
  code: { type: String, required: true },
  expiresAt: { type: Date, required: true, index: { expires: '5m' } } // Expire après 5 min
});

module.exports = mongoose.model("Otp", otpSchema);
