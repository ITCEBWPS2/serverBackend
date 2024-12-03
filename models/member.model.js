import mongoose from "mongoose";
import bcrypt from "bcrypt";

const memberSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
    },
    password: {
      type: String,
      required: false,
    },
    epf: {
      type: String,
      required: true,
    },
    dateOfJoined: {
      type: String,
    },
    dateOfBirth: {
      type: String,
    },
    dateOfRegistered: {
      type: String,
      //required: true,
    },
    welfareNo: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["admin", "member"],
    },
    payroll: {
      type: String,
      required: true,
    },
    division: {
      type: String,
      required: false,
    },
    branch: {
      type: String,
      required: false,
    },
    unit: {
      type: String,
      required: false,
    },
    contactNo: {
      whatsappNo: {
        type: Number,
      },
      number: {
        type: Number,
      },
    },
    spouseName: {
      type: String,
    },
    children: [
      {
        name: {
          type: String,
          required: false,
        },
        age: {
          type: Number,
          required: false,
        },
        gender: {
          type: String,
          required: false,
        },
      },
    ],
    motherName: {
      type: String,
    },
    motherAge: {
      type: Number,
    },
    fatherName: {
      type: String,
    },
    fatherAge: {
      type: Number,
    },
    motherInLawName: {
      type: String,
    },
    motherInLawAge: {
      type: Number,
    },
    fatherInLawName: {
      type: String,
    },
    fatherInLawAge: {
      type: Number,
    },
    memberFee: {
      type: Number,
      required: true,
    },
    loans: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Loan",
        default: [],
      },
    ],
    benefits: [String],
  },
  { timestamps: true }
);

// Middleware for hashing passwords
memberSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match passwords when login
memberSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Member = mongoose.model("Member", memberSchema);

export default Member;
