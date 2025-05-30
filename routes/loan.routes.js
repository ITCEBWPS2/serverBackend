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
  isSuperAdmin,
  isTreasurerOrAssistantTreasurer,
  protect,
} from "../middleware/auth.middleware.js";
import Loan from "../models/loan.model.js"; // Make sure to import the Loan model

const router = express.Router();

// ✅ Move this route to the top before dynamic ones
router.get("/approved-count/:epf", async (req, res) => {
  try {
    const { epf } = req.params;
    const count = await Loan.countDocuments({ epf: epf, loanStatus: "approved" });
    res.json({ count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to get loan count" });
  }
});

router
  .route("/")
  .post(protect, isTreasurerOrAssistantTreasurer, createLoanApplication)
  .get(protect, viewAllLoanApplications);

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

// ⚠️ Dynamic route should be LAST
router
  .route("/:id")
  .get(protect, viewSingleLoanApplication)
  .put(protect, isTreasurerOrAssistantTreasurer, updateLoanApplication)
  .delete(protect, isSuperAdmin, deleteLoanApplication);

export default router;
