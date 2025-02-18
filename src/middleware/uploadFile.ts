import multer from "multer";
import multerS3 from "multer-s3";
import { s3, BUCKET_NAME } from "../config/minio";

export const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: BUCKET_NAME,
        acl: "public-read", // السماح بالوصول العام للصور
        key: (req, file, cb) => {
            const fileName = `profile-${Date.now()}-${file.originalname}`;
            cb(null, fileName);
        }
    }),
    limits: { fileSize: 5 * 1024 * 1024 }, // الحد الأقصى 5 ميغابايت
    fileFilter: (req, file, cb) => {
        
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("❌ فقط الصور مسموحة!"));
        }
    }
});
