import mongoose from "mongoose";

const resumeChunkSchema = new mongoose.Schema(
  {
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      required: true,
    },

    chunkIndex: {
      type: Number,
      required: true,
    },

    text: {
      type: String,
      required: true,
    },

    section: {
      type: String,
      default: null,
    },

    embedding: {
      type: [Number],
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const ResumeChunk = mongoose.model(
  "ResumeChunk",
  resumeChunkSchema
);

export default ResumeChunk;