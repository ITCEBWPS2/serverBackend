import Member from "../models/member.model.js";
import Admin from "../models/admin.model.js";
import generateToken from "../utils/generateToken.js";
import bcrypt from "bcrypt";

// @desc Auhenticate User
// @route POST /api/members/auth
// @access Public (Admin/Member)
export const authUser = async (req, res) => {
  const { identifier, password } = req.body;

  try {
    const user = await Member.findOne({
      $or: [{ email: identifier }, { epf: identifier }],
    });

    if (user && (await user.matchPassword(password))) {
      // Generate and set token in cookie
      const token = generateToken(user._id, res);
      res.status(200).json({
        _id: user._id,
        name: user.name,
        role: user.role,
        token,
      });
    } else {
      res.status(401).json({ message: "Invalid EPF/ Email or Password!" });
    }
  } catch (error) {
    console.log("authUser", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc Register Member
// @route POST /api/members
// @access Private (Admin)
export const registerMember = async (req, res) => {
  const {
    name,
    email,
    password,
    epf,
    dateOfJoined,
    dateOfBirth,
    dateOfRegistered,
    welfareNo,
    role,
    payroll,
    division,
    branch,
    unit,
    contactNo,
    spouseName,
    children,
    motherName,
    motherAge,
    fatherName,
    fatherAge,
    motherInLawName,
    motherInLawAge,
    fatherInLawName,
    fatherInLawAge,
    memberFee,
  } = req.body;

  try {
    const userExists = await Member.findOne({
      $or: [{ epf }, { welfareNo }],
      //[{ email }, { epf }, { welfareNo }],
    });

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
      role,
      payroll,
      division,
      branch,
      unit,
      contactNo,
      spouseName,
      children,
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

    res.status(201).json({ data: { user: newUser } });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

// @desc Logout User
// @route POST /api/members/logout
// @access Private (Admin/Member)
export const logoutUser = async (req, res) => {
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

// @desc Get User Details
// @route GET /api/members/:id
// @access Private (Admin/Member)
export const getUserDetails = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    // Return member data without the password field
    const { password, ...memberWithoutPassword } = member.toObject();
    res.status(200).json(memberWithoutPassword);
  } catch (error) {
    console.error("Error fetching member details:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc Get Logged In User Details
// @route GET /api/members/me
// @access Private (Admin/Member)
export const getLoggedInUserDetails = async (req, res) => {
  try {
    const user = req.user;
    if (user) {
      res.json(user);
    } else {
      res.status(401).json({ message: "Not authenticated" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc Get All Users
// @route GET /api/members
// @access Private (Admin)
export const getAllUsers = async (req, res) => {
  try {
    const members = await Member.find();
    res.json(members);
  } catch (error) {
    console.error(err.message);
    res.status(500).json({ message: error.message });
  }
};

export const updateUserDetails = async (req, res) => {
  try {
    // Find the member by ID
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    // Check if password is being updated
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }

    // Update the member with the new details
    Object.assign(member, req.body);
    await member.save(); // This triggers the pre("save") middleware if other fields are modified

    res.status(200).json(member);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete User
// @route DELETE /api/members/:id
// @access Private (Admin)
export const deleteUser = async (req, res) => {
  try {
    const user = await Member.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.send({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// @desc Generate Welfare Number
// @route GET /api/members/util/generate-welfare-number
// @access Private (Admin)
export const generateWelfareNumber = async (req, res) => {
  try {
    let isUnique = false;
    let uniqueNumber;

    while (!isUnique) {
      uniqueNumber = Math.floor(100000 + Math.random() * 900000).toString();
      const existingMember = await Member.findOne({ welfareNo: uniqueNumber });
      if (!existingMember) {
        isUnique = true;
      }
    }

    res.status(200).json(uniqueNumber);
  } catch (error) {
    console.error("Error generating unique welfare number:", error);
    res.status(500).send({ message: error.message });
  }
};
