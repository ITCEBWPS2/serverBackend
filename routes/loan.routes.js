import express from "express";
import {
  createLoanApplication,
  getLoansByUserId,
  viewAllLoanApplications,
  viewSingleLoanApplication,
  updateLoanStatus,
  updateLoanApplication,
  deleteLoanApplication,
  generateLoanNumber,
} from "../controllers/loan.controller.js";
import { isAdmin, protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router
  .route("/")
  .post(protect, createLoanApplication)
  .get(protect, isAdmin, viewAllLoanApplications);

router
  .route("/:id")
  .get(protect, viewSingleLoanApplication)
  .put(protect, isAdmin, updateLoanApplication)
  .delete(protect, isAdmin, deleteLoanApplication);

router.get("/user/:userId", protect, getLoansByUserId);

router.put(":id/status", protect, isAdmin, updateLoanStatus);

router.get("/generate-loan-number", protect, isAdmin, generateLoanNumber);

export default router;
