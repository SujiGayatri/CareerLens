import mongoose from "mongoose";

const requirementSchema = new mongoose.Schema(
  {
    requirement: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    importance: {
      type: String,
      required: true,
      enum: ["required", "preferred", "nice_to_have"],
    },

    status: {
      type: String,
      required: true,
      enum: ["matched", "partially_matched", "missing"],
    },

    evidence: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

const analysisSchema = new mongoose.Schema(
  {
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      required: true,
    },

    jobDescriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobDescription",
      required: true,
    },

    provider: {
      type: String,
      default: null,
    },

    matchScore: {
      type: Number,
      min: 0,
      max: 100,
      default: null,
    },

    requirements: {
      type: [requirementSchema],
      default: [],
    },

    summary: {
      type: String,
      default: null,
    },

    recommendations: {
      type: [String],
      default: [],
    },

    rawResult: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Analysis = mongoose.model("Analysis", analysisSchema);

export default Analysis;