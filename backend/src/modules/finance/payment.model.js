const mongoose = require("mongoose");
const { encrypt, decrypt } = require("../../utils/encryption");

const paymentSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    fee: { type: mongoose.Schema.Types.ObjectId, ref: "Fee", required: true },
    amountPaid: { type: Number, required: true },
    paymentDate: { type: Date, default: Date.now },
    method: { type: String, enum: ["cash", "banque", "mobile_money"], default: "cash" },
    receivedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
    school: { type: mongoose.Schema.Types.ObjectId, ref: "School" },
    reference: { 
      type: String,
      set: v => encrypt(v),
      get: v => decrypt(v)
    },
    status: { type: String, enum: ["validé", "en_attente", "annulé"], default: "validé" }
  },
  { timestamps: true, toJSON: { getters: true }, toObject: { getters: true } }
);

module.exports = mongoose.model("Payment", paymentSchema);
