import { Router } from "express";
import { upload } from "../middleware/uploadPost"; // إعداد Multer
import { processFiles } from "../middleware/files.processing";

const router = Router();

router.post("/", upload.array("media",10), processFiles, (req, res) => {
    console.log(req.files);
    res.send("Files uploaded successfully");
});

export default router;
