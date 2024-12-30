import mongoose from "mongoose";

const scholarshipSchema = new mongoose.Schema(
  {
    benefit: {
      type: String,
      required: true,
    },
    epf: {
      type: String,
      required: true,
    },
    indexNumber: {
      type: String,
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Scholarship = mongoose.model("Scholarship", scholarshipSchema);

export default Scholarship;
