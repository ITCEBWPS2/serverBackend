import express from "express";
import {
  createDeathFund,
  viewAllDeathFunds,
  viewSingleDeathFund,
  updateDeathFund,
  deleteDeathFund,
  getBenefitsByUserId,
} from "../controllers/deathFund.controller.js";
import { isAdmin, protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router
  .route("/")
  .post(protect, isAdmin, createDeathFund)
  .get(protect, isAdmin, viewAllDeathFunds);

router
  .route("/:id")
  .get(protect, viewSingleDeathFund)
  .put(protect, isAdmin, updateDeathFund)
  .delete(protect, isAdmin, deleteDeathFund);

router.get("/benefits/:userId", protect, getBenefitsByUserId);

export default router;
