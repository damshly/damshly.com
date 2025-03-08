import { Router } from "express";
import userRoutes from "./users.routes";
import authRoutes from "./auth.routes";
import accountRoutes from "./account.routes"
import postRoutes from "./post.routes";
const router = Router();

router.use("/auth", authRoutes);
router.use("/account",accountRoutes)
router.use("/users", userRoutes);
router.use("/posts", postRoutes);

export default router;
