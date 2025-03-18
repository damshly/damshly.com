"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.s3 = exports.minioEndpoint = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const dotenv_1 = __importDefault(require("dotenv"));
// تحميل متغيرات البيئة من ملف .env
dotenv_1.default.config();
// إعداد MinIO endpoint بشكل ديناميكي
exports.minioEndpoint = `http://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}`;
exports.s3 = new client_s3_1.S3Client({
    region: "us-east-1", // MinIO لا يتحقق من المنطقة، لذا أي قيمة ستعمل
    endpoint: exports.minioEndpoint, // عنوان MinIO من .env
    credentials: {
        accessKeyId: process.env.MINIO_ACCESS_KEY || "minioadmin",
        secretAccessKey: process.env.MINIO_SECRET_KEY || "minioadmin"
    },
    forcePathStyle: true // مطلوب لـ MinIO
});
