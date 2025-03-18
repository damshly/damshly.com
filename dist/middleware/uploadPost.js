"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const minio_1 = require("../config/minio");
const BUCKET_NAME = "posts-files";
exports.upload = (0, multer_1.default)({
    storage: (0, multer_s3_1.default)({
        s3: minio_1.s3,
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
        }
        else {
            cb(new Error("❌ Only images, videos, and application files are allowed"));
        }
    }
});
