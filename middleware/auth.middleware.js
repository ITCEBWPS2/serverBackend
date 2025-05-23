import jwt from "jsonwebtoken";
import Member from "../models/member.model.js";

export const protect = async (req, res, next) => {
  try {
    let token;

    token = req.cookies.jwt;

    if (token) {
      try {
        // Create a decoded user object from the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Assign the decoded user to current user
        req.user = await Member.findById(decoded.userId).select("-password");
        console.log("current user",req.user);
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

export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Not authorized as an admin" });
  }
};

export const isAdminOrMember = (req, res, next) => {
  if (req.user && (req.user.role === "admin" || req.user.role === "member")) {
    next();
  } else {
    res.status(403).json({ message: "Not authorized as an admin or member" });
  }
};

// Authorization middleware for President and Vice President
export const isPresidentOrVicePresident = (req, res, next) => {
  if (
    req.user &&
    (req.user.role === "president" ||
      req.user.role === "vice_president" ||
      req.user.role === "super_admin")
  ) {
    next();
  } else {
    res.status(403).json({
      message: "Not authorized as a President, Vice President or Super Admin",
    });
  }
};

// Authorization middleware for Secretary and Assistant Secretary
export const isSecretaryOrAssistantSecretary = (req, res, next) => {
  if (
    req.user &&
    (req.user.role === "secretary" ||
      req.user.role === "assistant_secretary" ||
      req.user.role === "super_admin")
  ) {
    next();
  } else {
    res.status(403).json({
      message:
        "Not authorized as a Secretary, Assistant Secretary or Super Admin",
    });
  }
};

// Authorization middleware for Treasurer and Assistant Treasurer
export const isTreasurerOrAssistantTreasurer = (req, res, next) => {
  if (
    req.user &&
    (req.user.role === "treasurer" ||
      req.user.role === "assistant_treasurer" ||
      req.user.role === "super_admin")
  ) {
    next();
  } else {
    res.status(403).json({
      message:
        "Not authorized as a Treasurer, Assistant Treasurer or Super Admin",
    });
  }
};

// Authorization middleware for Treasurer and Assistant Treasurer
export const isSuperAdmin = (req, res, next) => {
  try {
    if (req.user && req.user.role === "super_admin") {
      console.log(req.user.role);
      
      next();
    } else{
      console.log(req.user);
       res.status(401).json({success:false,message:"Only can access from super admin"})
    }
    
  } catch (error) {
    console.log("Not authorized",error);
    
    res.status(403).json({message:"Not authorized as a Super Admin",error:error})
    
  }
  // if (req.user && req.user.role === "super_admin") {
  //   next();
  // } else {
  //   console.log();
    
  //   res.status(403).json({ message: "Not authorized as a Super Admin" });
  // }
};
