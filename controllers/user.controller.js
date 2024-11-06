import Member from "../models/member.model.js";
import generateToken from "../utils/generateToken.js";

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
// route POST /api/members
// @access Private
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
// route GET /api/users/:id
// @access Private
const getUserProfile = async (req, res) => {
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
    res.status(500).json({ message: "Server error" });
  }
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
    res.status(500).send("Server Error");
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
      return res.status(404).json({ message: "Member not found" });
    }

    res.status(200).json(updatedMember);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete user
// route DELETE /api/users/:id
// @access Private
const deleteUser = async (req, res) => {
  try {
    const user = await Member.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.send({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error", error });
  }
};

export {
  authUser,
  registerMember,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  deleteUser,
};
