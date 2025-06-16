import Member from "../models/member.model.js";
import generateToken from "../utils/generateToken.js";
import Logger from "../utils/Logger.js";
import bcrypt from "bcrypt";

// @desc Authenticate User
// @route POST /api/members/auth
// @access Public (Admin/Member)
export const authUser = async (req, res) => {
    const { identifier, password } = req.body;

    try {
        const user = await Member.findOne({
            $or: [{ email: identifier }, { epf: identifier }],
        });

        if (user && (await user.matchPassword(password))) {
            const token = generateToken(user._id, res);

            await Logger.info("com.ceb.userctrl.authUser", "User logged in successfully", user._id, {
                username: identifier,
                ip: req.ip,
                userAgent: req.get("User-Agent"),
            });

            return res.status(200).json({
                _id: user._id,
                name: user.name,
                role: user.role,
                token,
            });
        } else {
            await Logger.warn("com.ceb.userctrl.authUser", "Invalid login attempt", user ? user._id : null, {
                username: identifier,
                ip: req.ip,
                userAgent: req.get("User-Agent"),
            });
            return res.status(401).json({ message: "Invalid EPF/ Email or Password!" });
        }
    } catch (error) {
        await Logger.error("com.ceb.userctrl.authUser", "User authentication failed - " + error.message, null, {
            username: identifier,
            ip: req.ip,
            userAgent: req.get("User-Agent"),
        });

        return res.status(500).json({ message: "Server error" });
    }
};

// @desc Register Member
// @route POST /api/members
// @access Private (Admin)
export const registerMember = async (req, res) => {
    const { name, email, password, epf, dateOfJoined, dateOfBirth, dateOfRegistered, welfareNo, role, payroll, division, branch, unit, contactNo, spouseName, children, motherName, motherAge, fatherName, fatherAge, motherInLawName, motherInLawAge, fatherInLawName, fatherInLawAge, memberFee } = req.body;

    try {
        const userExists = await Member.findOne({
            $or: [{ epf }, { welfareNo }],
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

        await Logger.info("com.ceb.userctrl.registerMember", "New member registered", newUser._id, {
            performedBy: req.user?._id, // Logger added ✅
        });

        res.status(201).json({ data: { user: newUser } });
    } catch (error) {
        await Logger.error("com.ceb.userctrl.registerMember", error.message, null, {
            performedBy: req.user?._id, // Logger added ✅
        });

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

        await Logger.info("com.ceb.userctrl.logoutUser", "User logged out", req.user?._id, {
            ip: req.ip, // Logger added ✅
        });

        res.status(200).json({ message: "User logged out" });
    } catch (error) {
        await Logger.error("com.ceb.userctrl.logoutUser", error.message, req.user?._id); // Logger added ✅
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

        await Logger.info("com.ceb.userctrl.getUserDetails", "Viewed member details", req.user?._id, {
            viewedUserId: member._id, // Logger added ✅
        });

        const { password, ...memberWithoutPassword } = member.toObject();
        res.status(200).json(memberWithoutPassword);
    } catch (error) {
        await Logger.error("com.ceb.userctrl.getUserDetails", error.message, req.user?._id); // Logger added ✅
        res.status(500).json({ message: "Server error" });
    }
};

// @desc Get User By EPF
// @route GET /api/members/find/:epf
// @access Private (Admin/Member)
export const getUserByEpf = async (req, res) => {
    try {
        const member = await Member.findOne({ epf: req.params.epfnumber });

        if (!member) {
            return res.status(404).json({ message: "Member not found" });
        }

        await Logger.info("com.ceb.userctrl.getUserByEpf", "Viewed member by EPF", req.user?._id, {
            viewedEpf: req.params.epfnumber, // Logger added ✅
        });

        const { password, ...memberWithoutPassword } = member.toObject();
        res.status(200).json(memberWithoutPassword);
    } catch (error) {
        await Logger.error("com.ceb.userctrl.getUserByEpf", error.message, req.user?._id); // Logger added ✅
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
            await Logger.info("com.ceb.userctrl.getLoggedInUserDetails", "Fetched own details", user._id); // Logger added ✅
            res.json(user);
        } else {
            res.status(401).json({ message: "Not authenticated" });
        }
    } catch (error) {
        await Logger.error("com.ceb.userctrl.getLoggedInUserDetails", error.message); // Logger added ✅
        res.status(500).json({ message: "Server error" });
    }
};

// @desc Get All Users
// @route GET /api/members
// @access Private (Admin)
export const getAllUsers = async (req, res) => {
    try {
        const members = await Member.find();

        await Logger.info("com.ceb.userctrl.getAllUsers", "Fetched all members", req.user?._id); // Logger added ✅

        res.json(members);
    } catch (error) {
        await Logger.error("com.ceb.userctrl.getAllUsers", error.message, req.user?._id); // Logger added ✅
        res.status(500).json({ message: error.message });
    }
};

// @desc Update Member Details
// @route PUT /api/members/update/:epfnumber
// @access Private (Admin)
export const updateUserDetails = async (req, res) => {
    try {
        const member = await Member.findOne({ epf: req.params.epfnumber });
        if (!member) {
            return res.status(404).json({ message: "Member not found" });
        }

        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);
        }

        const updatedMember = await Member.findByIdAndUpdate(member._id, req.body, {
            new: true,
        });

        await Logger.info("com.ceb.userctrl.updateUserDetails", "Updated member details", updatedMember._id, {
            updatedBy: req.user?._id, // Logger added ✅
        });

        res.status(200).json(updatedMember);
    } catch (error) {
        await Logger.error("com.ceb.userctrl.updateUserDetails", error.message, req.user?._id); // Logger added ✅
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

        await Logger.warn("com.ceb.userctrl.deleteUser", "Deleted member", user._id, {
            deletedBy: req.user?._id, // Logger added ✅
        });

        res.send({ message: "User deleted successfully" });
    } catch (error) {
        await Logger.error("com.ceb.userctrl.deleteUser", error.message, req.user?._id); // Logger added ✅
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

        await Logger.info("com.ceb.userctrl.generateWelfareNumber", "Generated welfare number", null, {
            generatedBy: req.user?._id,
            generatedNumber: uniqueNumber, // Logger added ✅
        });

        res.status(200).json(uniqueNumber);
    } catch (error) {
        await Logger.error("com.ceb.userctrl.generateWelfareNumber", error.message, req.user?._id); // Logger added ✅
        res.status(500).send({ message: error.message });
    }
};
