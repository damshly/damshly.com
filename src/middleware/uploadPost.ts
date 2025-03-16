import multer from "multer";
import multerS3 from "multer-s3";
import { s3 } from "../config/minio";

const BUCKET_NAME = "posts-files";

export const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: BUCKET_NAME,
        acl: "public-read",
        key: (req, file, cb) => {
            const fileName = `post-${Date.now()}-${file.originalname}`;
            // console.log("Saving file:", fileName); // تأكد أن هذا يُطبع
            cb(null, fileName);
        }
    }),
    limits: { fileSize: 5000 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (!file) {
            console.error("❌ File is missing in fileFilter");
            return cb(new Error("❌ No file provided"));
        }
        // console.log(file.mimetype); // تحقق من نوع الملف
        if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/") || file.mimetype.startsWith("application/")) {
            cb(null, true);
        } else {
            cb(new Error("❌ Only images, videos, and application files are allowed"));
        }
    }
});
