import { Router } from "express";
import { getPosts, getPostById } from "../controllers/posts.controller";

const router = Router();

router.post("/",);

router.get("/:id");
router.put("/:id");
router.delete("/:id");

router.get("user/:id");

router.post("/{id}/like");

router.post("/{id}/comment");


export default router;
