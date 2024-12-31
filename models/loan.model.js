import mongoose from "mongoose";

const loanSchema = new mongoose.Schema(
  {
    epf: {
      type: String,
      required: true,
    },
    loanNumber: {
      type: String,
      required: true,
    },
    loanAmount: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    branch: {
      type: String,
      required: true,
    },
    contactNo: {
      mobile: {
        type: String,
        required: true,
      },
      landline: {
        type: String,
      },
    },
    nationalIdNumber: {
      type: String,
      required: true,
    },
    reasonForLoan: {
      type: String,
      required: true,
    },
    requiredLoanDate: {
      type: Date,
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    retirementDate: {
      type: Date,
      required: true,
    },
    loanStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Loan = mongoose.model("Loan", loanSchema);

export default Loan;
