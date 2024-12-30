import mongoose from "mongoose";

const retirementSchema = new mongoose.Schema(
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
    amount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Retirement = mongoose.model("Retirement", retirementSchema);

export default Retirement;
