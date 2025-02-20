import multer from "multer";
import multerS3 from "multer-s3";
import { s3 } from "../config/minio";

const BUCKET_NAME = "postsfiles";

export const uploadPosts = multer({
    storage: multerS3({
        s3: s3,
        bucket: BUCKET_NAME,
        acl: "public-read",
        contentType: multerS3.AUTO_CONTENT_TYPE,  // تأكد من حفظ نوع الملف
        key: (req, file, cb) => {
            const fileName = `post-${Date.now()}-${file.originalname}`;
            cb(null, fileName);
        },
    }),
    limits: { fileSize: 50 * 1024 * 1024 }, // الحد الأقصى لحجم الملف 50MB
    fileFilter: (req, file, cb) => {
        const allowedMimeTypes = [
            "image/png", "image/jpeg", "image/jpg", "image/webp",
            "video/mp4", "video/mkv", "video/webm",
            "application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ];
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("❌ فقط الصور، الفيديوهات والمستندات مسموحة!"));
        }
        
    },
});

// استخدم upload.array لاستقبال أكثر من ملف
