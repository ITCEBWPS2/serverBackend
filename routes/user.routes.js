import express from "express";
import {
  authUser,
  registerMember,
  getUserProfile,
  updateUserProfile,
  logoutUser,
  getAllUsers,
  deleteUser,
} from "../controllers/user.controller.js";
import { isAdmin, protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/auth", authUser);
router.post("/logout", protect, logoutUser);
router
  .route("/")
  .get(protect, isAdmin, getAllUsers)
  .post(protect, isAdmin, registerMember);
router
  .route("/:id")
  .get(protect, getUserProfile)
  .put(protect, isAdmin, updateUserProfile)
  .delete(protect, isAdmin, deleteUser);

export default router;
