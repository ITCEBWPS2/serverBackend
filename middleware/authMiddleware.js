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

export { protect };
