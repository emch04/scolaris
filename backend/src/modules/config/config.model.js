const mongoose = require("mongoose");

const configSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      // Exemple: "public_registration", "messaging", "score_input"
    },
    label: {
      type: String,
      required: true
    },
    enabled: {
      type: Boolean,
      default: true
    },
    description: {
      type: String
    },
    category: {
      type: String,
      default: "general"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Config", configSchema);
