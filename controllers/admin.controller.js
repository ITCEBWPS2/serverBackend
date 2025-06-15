import Admin from "../models/admin.model.js";
import Logger from "../utils/logger.js";
import generateToken from "../utils/generateToken.js";

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

            await Logger.info("com.ceb.adminctrl.authAdmin", "Admin logged in successfully", admin._id, {
                username: identifier,
                ip: req.ip,
                userAgent: req.get("User-Agent"),
            });

            return res.status(200).json({
                _id: admin._id,
                name: admin.name,
                role: admin.role,
                token,
            });
        } else {
            await Logger.warn("com.ceb.adminctrl.authAdmin", "Invalid login attempt", admin ? admin._id : null, {
                username: identifier,
                ip: req.ip,
                userAgent: req.get("User-Agent"),
            });
            return res.status(401).json({ message: "Invalid EPF/ Email or Password!" });
        }
    } catch (error) {
        await Logger.error("com.ceb.adminctrl.authAdmin", "Admin authentication failed - " + error.message, null, {
            username: identifier,
            ip: req.ip,
            userAgent: req.get("User-Agent"),
        });
        return res.status(500).json({ message: "Server error" });
    }
};

// @desc Register Admin
// @route POST /api/admins
// @access Private (Admin)
export const registerAdmin = async (req, res, next) => {
    const { name, email, password } = req.body;

    try {
        const adminExists = await Admin.findOne({
            email,
        });

        if (adminExists) {
            await Logger.warn("com.ceb.adminctrl.registerAdmin", "Admin registration failed - user already exists", null, {
                username: email,
                ip: req.ip,
                userAgent: req.get("User-Agent"),
            });
            return res.status(400).json({ message: "User already exists" });
        }

        let newAdmin = new Admin({
            name,
            email,
            password,
        });

        newAdmin = await newAdmin.save();

        await Logger.info("com.ceb.adminctrl.registerAdmin", "Admin registered successfully", newAdmin._id, {
            username: email,
            ip: req.ip,
            userAgent: req.get("User-Agent"),
        });

        return res.status(201).json({ data: { user: newAdmin } });
    } catch (error) {
        await Logger.critical("com.ceb.adminctrl.registerAdmin", "Admin registration failed - " + error.message, null, {
            username: email,
            ip: req.ip,
            userAgent: req.get("User-Agent"),
        });
        return res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};
