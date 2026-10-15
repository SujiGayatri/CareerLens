import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      required: true,
      trim: true,
    },

    fileSize: {
      type: Number,
      required: true,
    },

    extractedText: {
      type: String,
      required: true,
    },

    userId: {
      type: String,
      default: null,
    },

    status: {
      type: String,
      enum: ["uploaded", "processed", "failed"],
      default: "processed",
    },
  },
  {
    timestamps: true,
  }
);

const Resume = mongoose.model("Resume", resumeSchema);

export default Resume;