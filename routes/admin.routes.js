import express from "express";
import { protect, isSuperAdmin } from "../middleware/auth.middleware.js";
import { authAdmin, registerAdmin } from "../controllers/admin.controller.js";
const router = express.Router();

router.post("/auth", authAdmin);
router.post("/", protect, registerAdmin);


router.get("/me", protect, (req, res) => {
  console.log("Current user:", req.user);   
  res.status(200).json(req.user);
});

export default router;
