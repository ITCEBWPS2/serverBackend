import express from "express";
import {
  createScholarship,
  viewAllScholarships,
  updateScholarship,
  deleteScholarship,
  getBenefitsByUserId,
  viewSingleScholarship,
} from "../controllers/scholarship.controller.js";
import { isAdmin, protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router
  .route("/")
  .post(protect, isAdmin, createScholarship)
  .get(protect, isAdmin, viewAllScholarships);

router
  .route("/:id")
  .get(protect, viewSingleScholarship)
  .put(protect, isAdmin, updateScholarship)
  .delete(protect, isAdmin, deleteScholarship);

router.get("/benefits/:userId", protect, getBenefitsByUserId);

export default router;
