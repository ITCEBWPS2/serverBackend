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
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllUsers);
router.delete("/:id", deleteUser);
router.post("/", registerMember);
router.post("/auth", authUser);
router.post("/logout", logoutUser);
router.put("/:id", updateUserProfile);
// router
//   .route("/:id")
//   .get(protect, getUserProfile)
//   .put(protect, updateUserProfile);

router.route("/:id").get(getUserProfile).put(updateUserProfile);

export default router;
