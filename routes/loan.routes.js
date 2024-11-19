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
  getAllLoansByStatus,
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

router.put("/:loanId/status", protect, isAdmin, updateLoanStatus);

router.get("/util/generate-loan-number", protect, generateLoanNumber);

router.get("/util/loans-by-status", protect, isAdmin, getAllLoansByStatus);

export default router;
