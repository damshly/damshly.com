import { Router } from "express";
import { login, register, logout, refreshToken , verifyEmail} from "../controllers/auth.controller";
import { AuthValidation } from "../middleware/auth.validation";
const router = Router();

router.post("/register", AuthValidation.validateRegister, register);
router.post("/login",AuthValidation.validateLogin, login);
router.post("/logout", logout);
router.post("/refreshToken", AuthValidation.checkRefreshToken, refreshToken);
router.get("/verify-email", verifyEmail);

export default router;
