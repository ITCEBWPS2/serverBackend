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
  getUserByEpf,
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
router.get("/find/:epfnumber", protect, getUserByEpf);
router
  .route("/")
  .get( protect,getAllUsers)
  .post(protect, isSecretaryOrAssistantSecretary, registerMember);
router
  .route("/:epfnumber")
  // .get( protect,getUserDetails)
  .get( protect,getUserByEpf)
  // .put( protect, isSecretaryOrAssistantSecretary,updateUserDetails)
  .put( updateUserDetails)
// mekath super adminta witharai
  .delete(protect, isSuperAdmin, deleteUser);
router.get(
  "/util/generate-welfare-number",
  protect,
  isSecretaryOrAssistantSecretary,
  generateWelfareNumber
);

export default router;
