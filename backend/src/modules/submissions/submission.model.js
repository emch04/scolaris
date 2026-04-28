/**
 * @file submission.model.js
 * @description Modèle de données pour les devoirs rendus (soumissions).
 */
const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
  {
    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      required: true
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Parent",
      required: true
    },
    signatureUrl: {
      type: String, // Stockera le nom saisi par le parent
      required: true
    },
    comment: {
      type: String,
      trim: true
    },
    status: {
      type: String,
      enum: ["signé", "en attente"],
      default: "signé"
    }
  },
  {
    timestamps: true
  }
);

submissionSchema.index({ assignment: 1 });
submissionSchema.index({ student: 1 });
submissionSchema.index({ parent: 1 });

module.exports = mongoose.model("Submission", submissionSchema);
