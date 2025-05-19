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
      required: false,
    },
    address: {
      type: String,
      required: false,
    },
    position: {
      type: String,
      required: false,
    },
    branch: {
      type: String,
      required: false,
    },
    contactNo: {
      mobile: {
        type: String,
        required: false,
      },
      landline: {
        type: String,
      },
    },
    nationalIdNumber: {
      type: String,
      required: false,
    },
    reasonForLoan: {
      type: String,
      required: false,
    },
    requiredLoanDate: {
      type: Date,
      required: false,
    },
    dateOfBirth: {
      type: Date,
      required: false,
    },
    retirementDate: {
      type: Date,
      required: false,
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
