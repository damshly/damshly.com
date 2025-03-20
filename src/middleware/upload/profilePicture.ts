import multer from "multer";
import multerS3 from "multer-s3";
import { s3 } from "../../config/minio";

const BUCKET_NAME = "profile-pictures";

// Set up multer for file upload
export const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: BUCKET_NAME,
        acl: "public-read", 
        key: (req, file, cb) => {
            const fileName = `profile-${Date.now()}-${file.originalname}`;
            cb(null, fileName);
        }
    }),
    limits: { fileSize: 5 * 1024 * 1024 }, // Set file size limit to 5MB
    fileFilter: (req, file, cb) => {
        // Filter only image files
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("❌ only images are allowed"));
        }
    }
});

