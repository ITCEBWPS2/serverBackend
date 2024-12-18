import express from "express";
import {
  createRetirement,
  viewAllRetirements,
  updateRetirement,
  deleteRetirement,
  getBenefitsByUserId,
  viewSingleRetirement,
} from "../controllers/retirement.controller.js";
import { isAdmin, protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router
  .route("/")
  .post(protect, isAdmin, createRetirement)
  .get(protect, isAdmin, viewAllRetirements);

router
  .route("/:id")
  .get(protect, viewSingleRetirement)
  .put(protect, isAdmin, updateRetirement)
  .delete(protect, isAdmin, deleteRetirement);

router.get("/benefits/:userId", protect, getBenefitsByUserId);

export default router;
