import mongoose from "mongoose";

const medicalSchema = new mongoose.Schema(
  {
    benefit: {
      type: String,
      required: true,
    },
    epf: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    reason: {
      type: String,
    },
  },
  { timestamps: true }
);

const Medical = mongoose.model("Medical", medicalSchema);

export default Medical;
