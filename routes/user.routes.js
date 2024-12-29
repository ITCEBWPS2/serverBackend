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
  isSecretaryOrAssistantSecretary,
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
  .post(protect, isSecretaryOrAssistantSecretary, registerMember);
router
  .route("/:id")
  .get(protect, getUserDetails)
  .put(protect, isSecretaryOrAssistantSecretary, updateUserDetails)
  .delete(protect, isSuperAdmin, deleteUser);
router.get(
  "/util/generate-welfare-number",
  protect,
  isSecretaryOrAssistantSecretary,
  generateWelfareNumber
);

export default router;
