import { Router } from "express";
import userRoutes from "./users.routes";
import postRoutes from "./posts.routes";
import authRoutes from "./auth.routes";
import accountRoutes from "./account.routes"
import { postController } from "../controllers/posts.controller";
const router = Router();

router.use("/auth", authRoutes);
router.use("/account",accountRoutes)
router.use("/users", userRoutes);
router.use("/posts", postRoutes);

export default router;
