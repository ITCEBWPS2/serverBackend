import express from "express";
import { protect, isSuperAdmin } from "../middleware/auth.middleware.js";
import { getLogs, getLogStats } from "../controllers/log.controller.js";
const router = express.Router();

router.get("/logs", protect, isSuperAdmin, getLogs);
router.get("/logs/stats", protect, isSuperAdmin, getLogStats);

export default router;
