import { Router } from "express";
import { login, register, logout, refresh , verifyEmail} from "../controllers/auth.controller";
const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh", refresh);
router.get("/verify-email", verifyEmail);

export default router;
