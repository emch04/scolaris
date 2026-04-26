const mongoose = require("mongoose");

const salarySchema = new mongoose.Schema(
  {
    employee: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
    baseAmount: { type: Number, required: true },
    bonus: { type: Number, default: 0 },
    deductions: { type: Number, default: 0 },
    netAmount: { type: Number, required: true }, // base + bonus - deductions
    month: { type: String, required: true }, // Ex: "Mars 2026"
    paymentDate: { type: Date, default: Date.now },
    status: { type: String, enum: ["payé", "en_attente"], default: "payé" },
    school: { type: mongoose.Schema.Types.ObjectId, ref: "School", required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Salary", salarySchema);
