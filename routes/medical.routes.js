import express from "express";
import {
  createMedical,
  viewAllMedicals,
  updateMedical,
  deleteMedical,
  getBenefitsByUserId,
  viewSingleMedical,
} from "../controllers/medical.controller.js";
import {
  isSuperAdmin,
  isTreasurerOrAssistantTreasurer,
  protect,
} from "../middleware/auth.middleware.js";

const router = express.Router();

router
  .route("/")
  .post(protect, isTreasurerOrAssistantTreasurer, createMedical)
  .get(protect, viewAllMedicals);

router
  .route("/:id")
  .get(protect, viewSingleMedical)
  .put(protect, isTreasurerOrAssistantTreasurer, updateMedical)
  .delete(protect, isSuperAdmin, deleteMedical);

router.get("/benefits/:userId", protect, getBenefitsByUserId);

export default router;
