import jwt from "jsonwebtoken";
import Member from "../models/member.model.js";

const protect = async (req, res, next) => {
  try {
    let token;

    token = req.cookies.jwt;

    if (token) {
      try {
        // Create a decoded user object from the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Assign the decoded user to current user
        req.user = await Member.findById(decoded.userId).select("-password");

        next();
      } catch (error) {
        res.status(401);
        throw new Error("Invalid Token");
      }
    } else {
      res.status(401);
      throw new Error("Not authorized, No Token");
    }
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Not authorized as an admin" });
  }
};

const isAdminOrMember = (req, res, next) => {
  if (req.user && (req.user.role === "admin" || req.user.role === "member")) {
    next();
  } else {
    res.status(403).json({ message: "Not authorized as an admin or member" });
  }
};

export { protect, isAdmin, isAdminOrMember };
