import mongoose from "mongoose";

const jobDescriptionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      default: null,
    },

    company: {
      type: String,
      trim: true,
      default: null,
    },

    description: {
      type: String,
      required: true,
    },

    userId: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const JobDescription = mongoose.model(
  "JobDescription",
  jobDescriptionSchema
);

export default JobDescription;