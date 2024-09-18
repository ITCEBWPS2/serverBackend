import express from "express";
import { authUser,
    registerUser,
    getUserProfile,
    updateUserProfile,
    logoutUser,
    getAllUsers,
    deleteUser
} from "../controllers/userController.js";
import { protect} from "../middleware/authMiddleware.js";


const router = express.Router();

router.get("/", getAllUsers);
router.delete("/:id", deleteUser);
router.post("/", registerUser);
router.post("/auth", authUser);
router.post("/logout", logoutUser);
router.put("/:id", updateUserProfile);
router
  .route("/:id")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

export default router;
