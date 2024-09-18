import jwt from "jsonwebtoken";
import User from "../models/memberModel.js";

const protect = async (req, res, next) => {
    try {
        let token;

        // Check if token is present in cookies or Authorization header
        if (req.cookies.jwt) {
            token = req.cookies.jwt;
        } else if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({ message: "Not authorized, No Token" });
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // Attach user to request object, excluding password
            req.user = await User.findById(decoded.userId).select("-password");

            if (!req.user) {
                return res.status(401).json({ message: "No user found for this token" });
            }

            next();
        } catch (error) {
            res.status(401).json({ message: "Invalid Token" });
        }
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
};

export { protect };





// import jwt from "jsonwebtoken";
// import User from "../models/memberModel.js";

// // Create a middleware for JWT authentication

// const protect = async (req, res, next) => {
//     try {
//       let token;
  
//       token = req.cookies.jwt;
  
//       if (token) {
//         try {
//           // Create a decoded user object from the token
//           const decoded = jwt.verify(token, process.env.JWT_SECRET);
//           // Assign the decoded user to current user
//           req.user = await User.findById(decoded.userId).select("-password");
  
//           next();
//         } catch (error) {
//           res.status(401);
//           throw new Error("Invalid Token");
//         }
//       } else {
//         res.status(401);
//         throw new Error("Not authorized, No Token");
//       }
//     } catch (error) {
//       res.status(401).json({ message: error.message });
//     }
//   };
  
//   export { protect };
  