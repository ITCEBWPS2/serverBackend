import mongoose from "mongoose";

const medicalSchema = new mongoose.Schema(
  {
    benefit: {
      type: String,
      required: true,
    },
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      required: true,
    },
    date: {
      type: String,
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
