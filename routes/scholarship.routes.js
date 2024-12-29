import express from "express";
import {
  createScholarship,
  viewAllScholarships,
  updateScholarship,
  deleteScholarship,
  getBenefitsByUserId,
  viewSingleScholarship,
} from "../controllers/scholarship.controller.js";
import {
  isSuperAdmin,
  isTreasurerOrAssistantTreasurer,
  protect,
} from "../middleware/auth.middleware.js";

const router = express.Router();

router
  .route("/")
  .post(protect, isTreasurerOrAssistantTreasurer, createScholarship)
  .get(protect, viewAllScholarships);

router
  .route("/:id")
  .get(protect, viewSingleScholarship)
  .put(protect, isTreasurerOrAssistantTreasurer, updateScholarship)
  .delete(protect, isSuperAdmin, deleteScholarship);

router.get("/benefits/:userId", protect, getBenefitsByUserId);

export default router;
