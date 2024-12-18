import express from "express";
import {
  createRefund,
  viewAllRefunds,
  updateRefund,
  deleteRefund,
  getBenefitsByUserId,
  viewSingleRefund,
} from "../controllers/refund.controller.js";
import { isAdmin, protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router
  .route("/")
  .post(protect, isAdmin, createRefund)
  .get(protect, isAdmin, viewAllRefunds);

router
  .route("/:id")
  .get(protect, viewSingleRefund)
  .put(protect, isAdmin, updateRefund)
  .delete(protect, isAdmin, deleteRefund);

router.get("/benefits/:userId", protect, getBenefitsByUserId);

export default router;
