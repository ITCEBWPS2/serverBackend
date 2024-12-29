import express from "express";
import {
  createRefund,
  viewAllRefunds,
  updateRefund,
  deleteRefund,
  getBenefitsByUserId,
  viewSingleRefund,
} from "../controllers/refund.controller.js";
import {
  isSuperAdmin,
  isTreasurerOrAssistantTreasurer,
  protect,
} from "../middleware/auth.middleware.js";

const router = express.Router();

router
  .route("/")
  .post(protect, isTreasurerOrAssistantTreasurer, createRefund)
  .get(protect, viewAllRefunds);

router
  .route("/:id")
  .get(protect, viewSingleRefund)
  .put(protect, isTreasurerOrAssistantTreasurer, updateRefund)
  .delete(protect, isSuperAdmin, deleteRefund);

router.get("/benefits/:userId", protect, getBenefitsByUserId);

export default router;
