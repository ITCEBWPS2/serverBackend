import Member from "../models/memberModel.js";
import generateToken from "../utils/generateToken.js";

// @desc Delete user
// route DELETE /api/users/:id
// @access Private
const deleteUser = async (req, res) => {
  try {
    const user = await Member.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }
    res.send({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).send({ message: 'Internal Server Error', error });
  }
};

// @desc Auth user/set token
// route POST /api/users/auth
// @access Public
const authUser = async (req, res) => {
  const { epf, password } = req.body; // Changed from email to epf

  try {
    const user = await Member.findOne({ epf }); // Find by EPF number

    if (user && (await user.matchPassword(password))) {
      generateToken(user._id, res);
      res.status(200).json({
        _id: user._id,
        name: user.name,
        epf: user.epf,
        role: user.role, // Include role for admin check
        token: generateToken(user._id, res)
      });
    } else {
      res.status(401);
      throw new Error("Invalid EPF number or password!");
    } 
  } catch (error) {
    console.log("authUser", error);
    res.status(404).json({ message: error.message });
  }
};

// @desc Register user
// route POST /api/users
// @access Public
const registerUser = async (req, res) => {
  const { 
    name,
    email,
    password,
    epf,
    dateOfJoined,
    dateOfBirth,
    dateOfRegistered,
    welfareNo,
    payroll,
    division,
    branch,
    unit,
    contactNo,
    spouseName,
    children, // Updated: Expecting an array of child objects
    motherName,
    motherAge,
    fatherName,
    fatherAge,
    motherInLawName,
    motherInLawAge,
    fatherInLawName,
    fatherInLawAge,
    memberFee 
  } = req.body;

  try {
    const userExists = await Member.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }

    const newUser = new Member({
      name,
      email,
      password,
      epf,
      dateOfJoined,
      dateOfBirth,
      dateOfRegistered,
      welfareNo,
      payroll,
      division,
      branch,
      unit,
      contactNo,
      spouseName,
      children, // Set children directly from request
      motherName,
      motherAge,
      fatherName,
      fatherAge,
      motherInLawName,
      motherInLawAge,
      fatherInLawName,
      fatherInLawAge,
      memberFee,
    });

    await newUser.save();

    const token = generateToken(newUser._id, res);
    res.status(201).json({ data: { token, user: newUser } });
  } catch (error) {
    console.log(error);
    
    res.status(400).json({ message: error.message });
  }
};

// @desc Logout user
// route POST /api/users/logout
// @access Private
const logoutUser = async (req, res) => {
  try {
    res.cookie("jwt", "", {
      httpOnly: true,
      expires: new Date(0),
    });
    res.status(200).json({ message: "User logged out" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get user profile
// route GET /api/users/profile
// @access Private
const getUserProfile = async (req, res) => {
  const user = {
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    epf: req.user.epf,
    role: req.user.role,
  };
  res.status(200).json(user);
};

// @desc Get all users
// route GET /api/members
// @access Private
const getAllUsers = async (req, res) => {
  try {
    const members = await Member.find();
    res.json(members);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc Update user profile
// route PUT /api/users/:id
// @access Private
const updateUserProfile = async (req, res) => {
  try {
    const updatedMember = await Member.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // Return the updated document and run validators
    );

    if (!updatedMember) {
      return res.status(404).json({ message: 'Member not found' });
    }

    res.status(200).json(updatedMember);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  deleteUser
};






// import Member from "../models/memberModel.js";
// import generateToken from "../utils/generateToken.js";



// // @desc Delete user
// // route DELETE /api/users/:id
// // @access Private
// const deleteUser = async (req, res) => {
//   try {
//     const user = await Member.findByIdAndDelete(req.params.id);
//     if (!user) {
//       return res.status(404).send({ message: 'User not found' });
//     }
//     res.send({ message: 'User deleted successfully' });
//   } catch (error) {
//     res.status(500).send({ message: 'Internal Server Error', error });
// }

// };



// // @desc Auth user/set token
// // route POST /api/users/auth
// // @access Public

// //=========================================
// // const authUser = async (req, res) => {
// //     const { email, password } = req.body;
  
// //     try {
// //       const user = await Member.findOne({ email });
  
// //       if (user && (await user.matchPassword(password))) {
// //         generateToken(res, user._id);
// //         res.status(200).json(user);
// //       } else {
// //         res.status(401);
// //         throw new Error("Invalid email or password!");
// //       }
// //     } catch (error) {
// //       res.status(404).json({ message: error.message });
// //     }
// //   };
// // Update the authUser function to use epf instead of email for login
// const authUser = async (req, res) => {
//   const { epf, password } = req.body; // changed email to epf

//   try {
//     const user = await Member.findOne({ epf }); // find by epf

//     if (user && (await user.matchPassword(password))) {
//       generateToken( user._id,res);
//       res.status(200).json({
//         _id: user._id,
//         name: user.name,
//         epf: user.epf,
//         role: user.role, // include role for admin check
//         token: generateToken(user._id,res)
//       });
//     } else {
//       res.status(401);
//       throw new Error("Invalid EPF number or password!");
//     } 
//   } catch (error) {
//     console.log("authUser",error);
    
//     res.status(404).json({ message: error.message });
//   }
// };




  
//   // @desc Register user
//   // route POST /api/users
//   // @access Public
//   const registerUser = async (req, res) => {

//     const { 
//       name,
//       email,
//       password,
//       epf,
//       // status,
//       dateOfJoined,
//       dateOfBirth,
//       dateOfRegistered,
//       welfareNo,
//       payroll,
//       division,
//       branch,
//       unit,
//       contactNo,
//       spouseName,
//       childName,
//       childAge,
//       genderChild,
//       motherName,
//       motherAge,
//       fatherName,
//       fatherAge,
//       motherInLawName,
//       motherInLawAge,
//       fatherInLawName,
//       fatherInLawAge,

     
//       memberFee, } = req.body;
//       // const {whatsappNo,number}= req.body.contactNo
//     try {
//       const userExists = await Member.findOne({ email });
  
//       if (userExists) {
//         res.status(400);
//         throw new Error("User already exists");
//       }
  
//       const newUser = new Member({
//       name,
//       email,
//       password,
//       epf,
//       // status,
//       dateOfJoined,
//       dateOfBirth,
//       dateOfRegistered,
//       welfareNo,
//       payroll,
//       division,
//       branch,
//       unit,
//       contactNo,
//       spouseName,
//       childName,
//       childAge,
//       genderChild,
//       motherName,
//       motherAge,
//       fatherName,
//       fatherAge,
//       motherInLawName,
//       motherInLawAge,
//       fatherInLawName,
//       fatherInLawAge,
//       memberFee,
//       });
      
  
//       const token=generateToken(newUser._id,res);
//       await newUser.save();
  
//       console.log(token);
      
  
//       res.status(201).json({data:{token,user:newUser}});
//     } catch (error) {
//       res.status(400).json({ message: error.message });
//     }
//   };
  
//   // @desc Logout user
//   // route POST /api/users
//   // @access Private
//   const logoutUser = async (req, res) => {
//     try {
//       res.cookie("jwt", "", {
//         httpOnly: true,
//         expires: new Date(0),
//       });
//       res.status(200).json({ message: "User logged out" });
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   };
  
//   // @desc Get user profile
//   // route GET /api/users/id
//   // @access Private
//   const getUserProfile = async (req, res) => {
//     const user = {
//       _id: req.user._id,
//       name: req.user.name,
//       email: req.user.email,
//     };
//     res.status(200).json(user);
//   };

//   // @desc Get all users
//   // route GET /api/members
//   // @access Private
//   const getAllUsers = async (req,res) => {
//     try {
//       const members = await Member.find();
//       res.json(members);
//     } catch (err) {
//       console.error(err.message);
//       res.status(500).send('Server Error');
//     }
//   }
  
//   // @desc Update user profile
//   // route PUT /api/users/id
//   // @access Private
 
//   const updateUserProfile = async (req, res) => {
//     try {
//       const updatedMember = await Member.findByIdAndUpdate(
//         req.params.id,
//         req.body,
//         { new: true, runValidators: true } // Return the updated document and run validators
//       );
  
//       if (!updatedMember) {
//         return res.status(404).json({ message: 'Member not found' });
//       }
  
//       res.status(200).json(updatedMember);
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   };
//   // const updateUserProfile = async (req, res) => {
//   //   try {
//   //     const user = await Member.findById(req.user._id);
  
//   //     if (user) {
//   //       user.name = req.body.name || user.name;
//   //       user.email = req.body.email || user.email;
  
//   //       if (req.body.password) {
//   //         user.password = req.body.password;
//   //       }
  
//   //       const updatedUser = await user.save();
//   //       res.status(200).json(updatedUser);
//   //     } else {
//   //       res.status(404);
//   //       throw new Error("User not found!");
//   //     }
//   //   } catch (error) {
//   //     res.status(500).json({ message: error.message });
//   //   }
//   // };
  
//   export {
//     authUser,
//     registerUser,
//     logoutUser,
//     getUserProfile,
//     updateUserProfile,
//     getAllUsers,
//     deleteUser
//   };
  


  