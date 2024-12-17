import mongoose from "mongoose";

const deathFundSchema = new mongoose.Schema(
  {
    benefit: {
      type: String,
      required: true,
    },
    memberId: {
      type: String,
      required: true,
    },
    epfNumber: {
      type: String,
      required: true,
    },
    personType: {
      type: String,
      required: true,
    },
    amount: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    additionalNotes: {
      type: String,
    },
  },
  { timestamps: true }
);

const DeathFund = mongoose.model("DeathFund", deathFundSchema);

export default DeathFund;
