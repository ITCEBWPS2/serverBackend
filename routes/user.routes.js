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
import {
  isSecretoryOrAssistantSecretory,
  isSuperAdmin,
  protect,
} from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/auth", authUser);
router.post("/logout", logoutUser);
router.get("/me", protect, getLoggedInUserDetails);
router
  .route("/")
  .get(protect, getAllUsers)
  .post(protect, isSecretoryOrAssistantSecretory, registerMember);
router
  .route("/:id")
  .get(protect, getUserDetails)
  .put(protect, isSecretoryOrAssistantSecretory, updateUserDetails)
  .delete(protect, isSuperAdmin, deleteUser);
router.get(
  "/util/generate-welfare-number",
  protect,
  isSecretoryOrAssistantSecretory,
  generateWelfareNumber
);

export default router;
