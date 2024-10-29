import jwt from "jsonwebtoken";
import Member from "../models/memberModel.js";

const protect = async (req, res, next) => {
  try {
    let token;

    // Retrieve token from cookies or Authorization header
    if (req.cookies.jwt) {
      token = req.cookies.jwt;
    } else if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token provided" });
    }

    try {
      // Verify token and use userId from the decoded payload
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await Member.findById(decoded.userId).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "User not found for this token" });
      }

      next();
    } catch (error) {
      res.status(401).json({ message: "Invalid token" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export { protect };
