import mongoose from "mongoose";

const deathFundSchema = new mongoose.Schema(
  {
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
    additionalNotes: {
      type: String,
    },
  },
  { timestamps: true }
);

const DeathFund = mongoose.model("DeathFund", deathFundSchema);

export default DeathFund;
