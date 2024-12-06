import express from "express";
import { registerAdmin } from "../controllers/user.controller.js";
import { isAdmin, protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protect, isAdmin, registerAdmin);

export default router;
