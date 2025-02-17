import { Router } from "express";
import { login, register, logout, refreshToken , verifyEmail} from "../controllers/auth.controller";
const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refreshToken", refreshToken);
router.get("/verify-email", verifyEmail);

export default router;
