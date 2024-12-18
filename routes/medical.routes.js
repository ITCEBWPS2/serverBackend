import express from "express";
import {
  createMedical,
  viewAllMedicals,
  updateMedical,
  deleteMedical,
  getBenefitsByUserId,
  viewSingleMedical,
} from "../controllers/medical.controller.js";
import { isAdmin, protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router
  .route("/")
  .post(protect, isAdmin, createMedical)
  .get(protect, isAdmin, viewAllMedicals);

router
  .route("/:id")
  .get(protect, viewSingleMedical)
  .put(protect, isAdmin, updateMedical)
  .delete(protect, isAdmin, deleteMedical);

router.get("/benefits/:userId", protect, getBenefitsByUserId);

export default router;
