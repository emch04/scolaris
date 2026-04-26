const mongoose = require("mongoose");

const feeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, // Ex: "Minerval 1er Trimestre"
    amount: { type: Number, required: true },
    currency: { type: String, default: "USD" },
    school: { type: mongoose.Schema.Types.ObjectId, ref: "School", required: true },
    classroom: { type: mongoose.Schema.Types.ObjectId, ref: "Classroom" }, // Si spécifique à une classe
    dueDate: { type: Date },
    category: { type: String, enum: ["scolarité", "inscription", "autre"], default: "scolarité" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Fee", feeSchema);
