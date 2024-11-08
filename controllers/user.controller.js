import Member from "../models/member.model.js";
import generateToken from "../utils/generateToken.js";

// @desc Auhenticate User
// @route POST /api/auth
// @access Public (Admin/Member)
const authUser = async (req, res) => {
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
const registerMember = async (req, res) => {
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
      $or: [{ email }, { epf }, { welfareNo }],
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

// @desc Get User Details
// @route GET /api/members/:id
// @access Private (Admin/Member)
const getUserDetails = async (req, res) => {
  try {
    const user = await Member.findById(req.params.id).select(
      "name email epf dateOfJoined dateOfBirth dateOfRegistered welfareNo role payroll division branch unit contactNo spouseName test motherName motherAge fatherName fatherAge motherInLawName motherInLawAge fatherInLawName fatherInLawAge memberFee"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc Get All Users
// @route GET /api/members
// @access Private (Admin)
const getAllUsers = async (req, res) => {
  try {
    const members = await Member.find();
    res.json(members);
  } catch (error) {
    console.error(err.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc Update User Details
// @route PUT /api/members/:id
// @access Private (Admin)
const updateUserDetails = async (req, res) => {
  try {
    const updatedMember = await Member.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedMember) {
      return res.status(404).json({ message: "Member not found" });
    }

    res.status(200).json(updatedMember);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete User
// @route DELETE /api/members/:id
// @access Private (Admin)
const deleteUser = async (req, res) => {
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

export {
  authUser,
  registerMember,
  logoutUser,
  getUserDetails,
  updateUserDetails,
  getAllUsers,
  deleteUser,
};
