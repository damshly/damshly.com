import { Router } from "express";
import { upload } from "../middleware/upload/post"; // إعداد Multer
import { processFiles } from "../middleware/processing/files";
import { processPost } from "../middleware/processing/post";
import { authentication } from "../middleware/Authentication/user";
import { PostsController } from "../controllers/posts.controller";
const router = Router();

router.post("/",authentication.checkJwt,upload.array("media",10), processFiles,processPost,PostsController.createPost);
router.get("/:id",PostsController.getPost);
export default router;
