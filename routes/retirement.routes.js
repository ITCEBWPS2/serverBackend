import express from "express";
import {
  createRetirement,
  viewAllRetirements,
  updateRetirement,
  deleteRetirement,
  getBenefitsByUserId,
  viewSingleRetirement,
} from "../controllers/retirement.controller.js";
import {
  isAdmin,
  isSuperAdmin,
  isTreasurerOrAssistantTreasurer,
  protect,
} from "../middleware/auth.middleware.js";

const router = express.Router();

router
  .route("/")
  .post(protect, isTreasurerOrAssistantTreasurer, createRetirement)
  .get(protect, viewAllRetirements);

router
  .route("/:id")
  .get(protect, viewSingleRetirement)
  .put(protect, isTreasurerOrAssistantTreasurer, updateRetirement)
  .delete(protect, isSuperAdmin, deleteRetirement);

router.get("/benefits/:userId", protect, getBenefitsByUserId);

export default router;
