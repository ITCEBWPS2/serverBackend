import Admin from "../models/admin.model";
import generateToken from "../utils/generateToken.js";
import bcrypt from "bcrypt";

// @desc Auhenticate Admin
// @route POST /api/admins/auth
// @access Public (Admin/Member)
export const authAdmin = async (req, res) => {
  const { identifier, password } = req.body;

  try {
    const admin = await Admin.findOne({
      $or: [{ email: identifier }, { epf: identifier }],
    });

    if (admin && (await admin.matchPassword(password))) {
      // Generate and set token in cookie
      const token = generateToken(admin._id, res);
      res.status(200).json({
        _id: admin._id,
        name: admin.name,
        role: admin.role,
        token,
      });
    } else {
      res.status(401).json({ message: "Invalid EPF/ Email or Password!" });
    }
  } catch (error) {
    console.log("authAdmin", error);
    res.status(500).json({ message: "Server error" });
  }
};
