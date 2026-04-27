const mongoose = require("mongoose");
const { encrypt, decrypt } = require("../../utils/encryption");

const logSchema = new mongoose.Schema(
  {
    level: { type: String, enum: ["INFO", "WARN", "ERROR", "FATAL"], default: "ERROR" },
    message: { type: String, required: true },
    stack: { 
      type: String,
      set: v => encrypt(v),
      get: v => decrypt(v)
    },
    url: { type: String },
    user: { type: mongoose.Schema.Types.Mixed, default: "Guest" },
    userAgent: { type: String },
    ip: { 
      type: String,
      set: v => encrypt(v),
      get: v => decrypt(v)
    },
    resolved: { type: Boolean, default: false },
    resolvedAt: { type: Date }
  },
  { timestamps: true, toJSON: { getters: true }, toObject: { getters: true } }
);

logSchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });

module.exports = mongoose.model("Log", logSchema);
