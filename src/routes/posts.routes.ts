import { Router } from "express";
import { postController  } from "../controllers/posts.controller";
import { AuthValidation } from "../middleware/auth.validation";
import { uploadPosts } from "../middleware/uploadPosts";
import { validatePostData } from "../middleware/files.validation";
import { postActionController } from "../controllers/posts.controller";
import {formatpostections} from "../middleware/formatpostections"
import multer from "multer";
const router = Router();
const upload = uploadPosts.array("files", 10)

router.get("/info",postController.getPostsInfo);
router.post("/",AuthValidation.checkJwt,upload,validatePostData,formatpostections,postActionController.makePost);
router.get("/:id",postController.getPostById);
router.get("/info/:id",postController.getPostInfoById);
router.put("/:id");
router.delete("/:id");      

router.get("user/:id");

router.post("/{id}/like");

router.post("/{id}/comment");


export default router;
