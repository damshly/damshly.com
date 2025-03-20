import { Router } from "express";
import { auth } from "../controllers/auth.controller";
import { authentication } from "../middleware/Authentication/user";
import { userValidation } from "../middleware/validation/user";
const router = Router();

router.post("/register", userValidation.registerData, auth.register);
router.post("/login",userValidation.loginData, auth.login);
router.post("/logout", auth.logout);
router.post("/refreshToken", authentication.checkRefreshToken, auth.refreshToken);
router.get("/verify-email", auth.verifyEmail);

export default router;
