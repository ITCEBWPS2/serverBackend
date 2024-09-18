import mongoose from 'mongoose';

const loanSchema = new mongoose.Schema(
  {
    memberNumber: { 
      type: String, 
      required: true 
    },
    epfNumber: { 
      type: String, 
      required: true 
    },
    loanNumber: { 
      type: String, 
      required: true 
    },
    loanAmount: { 
      type: Number, 
      required: true 
    },
    name: { 
      type: String, 
      required: true 
    },
    address: { 
      type: String, 
      required: true 
    },
    position: { 
      type: String, 
      required: true 
    },
    branch: { 
      type: String, 
      required: true 
    },
    contactNo: {
      phoneNumberMobile: { 
        type: String, 
        required: true 
      },
      phoneNumberLandline: { 
        type: String 
      }
    },
    nationalIdNumber: { 
      type: String, 
      required: true 
    },
    reasonForLoan: { 
      type: String, 
      required: true 
    },
    requiredLoanDate: { 
      type: Date, 
      required: true 
    },
    dateOfBirth: { 
      type: Date, 
      required: true 
    },
    retirementDate: { 
      type: Date, 
      required: true 
    },
    loanStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending"
    }
  },
  { timestamps: true }
);

const Loan = mongoose.model('Loan', loanSchema);
export default Loan;


// import mongoose from 'mongoose'

// const LoanSchema = new mongoose.Schema({
//   memberNumber: { type: String, required: true },
//   epfNumber: { type: String, required: true },
//   loanNumber: { type: String, required: true },
//   loanAmount: { type: Number, required: true },
//   name: { type: String, required: true },
//   address: { type: String, required: true },
//   position: { type: String, required: true },
//   branch: { type: String, required: true },
//   phoneNumberMobile: { type: String, required: true },
//   phoneNumberLandline: { type: String },
//   nationalIdNumber: { type: String, required: true },
//   reasonForLoan: { type: String, required: true },
//   requiredLoanDate: { type: Date, required: true },
//   dateOfBirth: { type: Date, required: true },
//   retirementDate: { type: Date, required: true },
// }, { timestamps: true });


// const LoanModel=mongoose.model('Loan',LoanSchema)
// export default LoanModel
