"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const uploadPost_1 = require("../middleware/uploadPost"); // إعداد Multer
const files_processing_1 = require("../middleware/files.processing");
const post_processing_1 = require("../middleware/post.processing");
const auth_validation_1 = require("../middleware/auth.validation");
const posts_controller_1 = require("../controllers/posts.controller");
const router = (0, express_1.Router)();
router.post("/", auth_validation_1.AuthValidation.checkJwt, uploadPost_1.upload.array("media", 10), files_processing_1.processFiles, post_processing_1.processPost, posts_controller_1.PostsController.createPost);
exports.default = router;
