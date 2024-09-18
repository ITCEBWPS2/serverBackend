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
        required: true,
        unique: true,
      },
      password: {
        type: String,
        required: true,
      },
      epf: {
        type: String,
        required: true,
      },
      status: {
        type: String,
        required: true,
      },
      dateOfJoined: {
        type: String,
        required: true,
      },
      dateOfBirth: {
        type: String,
        required: true,
      },
      dateOfRegistered: {
        type: String,
        required: true,
      },
      welfareNo: {
        type: String,
        required: true,
      },
      role: {
        type: String,
        // required: true,
        enum: ["admin", "user"],
        default: "admin"
      },
      payroll: {
        type: String,
        required: true,
      },
      division: {
        type: String,
        required: true,
      },
      // status: {
      //   type: String,
      //   required: true,
      // },
      contactNo: {
        whatsappNo: {
          type: String,
          required: true,
        },
        number: {
          type: String,
          required: true,
        }
      },
      benefits:[String],
      spouseName: {
        type: String,
      },
      noOfChildren: {
        type: String,
       
      },
      aboutChildren: {
        type: String,
        
      },
      noOfAdults: {
        type: String,
       
      },
      aboutAdults: {
        type: String,
        
      },
      loans: [],
      memberFee: {
        type: String,
        required: true,
      },

      
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
  