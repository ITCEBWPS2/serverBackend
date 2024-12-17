import express from "express";
import { createDeathFund } from "../controllers/deathFund.controller.js";
import { isAdmin, protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protect, isAdmin, createDeathFund);

export default router;
