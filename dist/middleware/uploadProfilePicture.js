"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const minio_1 = require("../config/minio");
const BUCKET_NAME = "profile-pictures";
// Set up multer for file upload
exports.upload = (0, multer_1.default)({
    storage: (0, multer_s3_1.default)({
        s3: minio_1.s3,
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
        }
        else {
            cb(new Error("❌ only images are allowed"));
        }
    }
});
