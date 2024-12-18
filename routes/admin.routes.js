import express from "express";
import { authAdmin, registerAdmin } from "../controllers/admin.controller.js";
import { isAdmin, protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/auth", authAdmin);
router.post("/", protect, isAdmin, registerAdmin);

export default router;
