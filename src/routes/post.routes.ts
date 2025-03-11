import { Router } from "express";
import { upload } from "../middleware/uploadPost"; // إعداد Multer
import { processFiles } from "../middleware/files.processing";
import { AuthValidation } from "../middleware/auth.validation";
import { PostsController } from "../controllers/posts.controller";
const router = Router();

router.post("/",AuthValidation.checkJwt, upload.array("media",10), processFiles,
PostsController.createTextPost
);

export default router;
