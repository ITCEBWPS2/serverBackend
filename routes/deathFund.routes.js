import express from "express";
import {
  createDeathFund,
  viewAllDeathFunds,
  viewSingleDeathFund,
  updateDeathFund,
  deleteDeathFund,
  getBenefitsByUserId,
} from "../controllers/deathFund.controller.js";
import {
  isSuperAdmin,
  isTreasurerOrAssistantTreasurer,
  protect,
} from "../middleware/auth.middleware.js";

const router = express.Router();

router
  .route("/")
  .post(protect, isTreasurerOrAssistantTreasurer, createDeathFund)
  .get(protect, viewAllDeathFunds);

router
  .route("/:id")
  .get(protect, viewSingleDeathFund)
  .put(protect, isTreasurerOrAssistantTreasurer, updateDeathFund)
  .delete(protect, isSuperAdmin, deleteDeathFund);

router.get("/benefits/:userId", protect, getBenefitsByUserId);

export default router;
