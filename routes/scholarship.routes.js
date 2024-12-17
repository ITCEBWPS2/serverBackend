import express from "express";
import { createScholarship } from "../controllers/scholarship.controller.js";
import { isAdmin, protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protect, isAdmin, createScholarship);

export default router;
