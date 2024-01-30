import { Router } from "express";
import { loginUser, registerUser, logoutUser, changePassword, getCurrentUser } from "../controllers/userController.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/signup").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/changePassword").post(verifyJWT, changePassword)
router.route("/getUser").get(getCurrentUser)

export default router;