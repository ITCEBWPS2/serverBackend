import express from "express";
import {
  authUser,
  registerMember,
  updateUserDetails,
  getUserDetails,
  getLoggedInUserDetails,
  logoutUser,
  getAllUsers,
  deleteUser,
  generateWelfareNumber,
} from "../controllers/user.controller.js";
import { isAdmin, protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/auth", authUser);
router.post("/logout", logoutUser);
router.get("/me", protect, getLoggedInUserDetails);
router
  .route("/")
  .get(protect, isAdmin, getAllUsers)
  .post(protect, isAdmin, registerMember);
router
  .route("/:id")
  .get(protect, getUserDetails)
  .put(protect, isAdmin, updateUserDetails)
  .delete(protect, isAdmin, deleteUser);
router.get("/generate-welfare-number", isAdmin, generateWelfareNumber);

export default router;
