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
import {
  isAdmin,
  isSuperAdmin,
  isTreasurerOrAssistantTreasurer,
  protect,
} from "../middleware/auth.middleware.js";

const router = express.Router();

router
  .route("/")
  .post(protect, isTreasurerOrAssistantTreasurer, createLoanApplication)
  .get(protect, viewAllLoanApplications);

router
  .route("/:id")
  .get(protect, viewSingleLoanApplication)
  .put(protect, isTreasurerOrAssistantTreasurer, updateLoanApplication)
  .delete(protect, isSuperAdmin, deleteLoanApplication);

router.get("/user/:userId", protect, getLoansByUserId);

router.put(
  "/:loanId/status",
  protect,
  isTreasurerOrAssistantTreasurer,
  updateLoanStatus
);

router.get(
  "/util/generate-loan-number",
  protect,
  isTreasurerOrAssistantTreasurer,
  generateLoanNumber
);

router.get("/util/loans-by-status", protect, getAllLoansByStatus);

export default router;
