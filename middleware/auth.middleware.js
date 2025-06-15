import jwt from "jsonwebtoken";
import Admin from "../models/member.model.js"

export const protect = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({ message: "Not authorized, no token" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await Admin.findById(decoded.userId).select("-password");
        console.log("current user", req.user);
        next();
    } catch (error) {
        console.error("Auth Error:", error);
        return res.status(401).json({ message: "Invalid token" });
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
    if (req.user && (req.user.role === "president" || req.user.role === "vice_president" || req.user.role === "super_admin")) {
        next();
    } else {
        res.status(403).json({
            message: "Not authorized as a President, Vice President or Super Admin",
        });
    }
};

// Authorization middleware for Secretary and Assistant Secretary
export const isSecretaryOrAssistantSecretary = (req, res, next) => {
    if (req.user && (req.user.role === "secretary" || req.user.role === "assistant_secretary" || req.user.role === "super_admin")) {
        next();
    } else {
        res.status(403).json({
            message: "Not authorized as a Secretary, Assistant Secretary or Super Admin",
        });
    }
};

// Authorization middleware for Treasurer and Assistant Treasurer
export const isTreasurerOrAssistantTreasurer = (req, res, next) => {
    if (req.user && (req.user.role === "treasurer" || req.user.role === "assistant_treasurer" || req.user.role === "super_admin")) {
        next();
    } else {
        res.status(403).json({
            message: "Not authorized as a Treasurer, Assistant Treasurer or Super Admin",
        });
    }
};

// Authorization middleware for Treasurer and Assistant Treasurer
export const isSuperAdmin = (req, res, next) => {
    console.log("user", req.user);
    if (req.user && req.user.role === "super_admin") {
        next();
    } else {
        res.status(403).json({ message: "Access denied. Super Admins only." });
    }
    // if (req.user && req.user.role === "super_admin") {
    //   next();
    // } else {
    //   console.log();

    //   res.status(403).json({ message: "Not authorized as a Super Admin" });
    // }

    const authMiddleware = (req, res, next) => {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "No token, authorization denied" });
        }

        const token = authHeader.split(" ")[1];
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded; // Can use this later if needed
            next();
        } catch (err) {
            res.status(401).json({ message: "Token is not valid" });
        }
    };
};
