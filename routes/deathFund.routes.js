import express from "express";
import {
  createDeathFund,
  viewAllDeathFunds,
  viewSingleDeathFund,
  updateDeathFund,
  deleteDeathFund,
} from "../controllers/deathFund.controller.js";
import { isAdmin, protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protect, isAdmin, createDeathFund);
router
  .route("/")
  .post(protect, isAdmin, createDeathFund)
  .get(protect, isAdmin, viewAllDeathFunds);

router
  .route("/:id")
  .get(protect, viewSingleDeathFund)
  .put(protect, isAdmin, updateDeathFund)
  .delete(protect, isAdmin, deleteDeathFund);

export default router;
