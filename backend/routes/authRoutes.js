import express from "express";
import { getUserById, loginUser, logoutUser, registerUser} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import { userSchema, validateUser } from "../utils/userValidate.js";
import { sendContactMail } from "../email/contactController.js";
const router = express.Router();

// Routes
router.post("/register",validateUser(userSchema), registerUser);
router.post("/login",  loginUser);
router.post("/logout",protect, logoutUser);

// router.post("/verify", verification);
// router.post("/forgot-password", forgotPassword);

// router.post("/reset-password/:token", resetPassword);
// protected route as token will be required
router.get("/profile",protect, getUserById)
router.post("/contact",sendContactMail)

export default router