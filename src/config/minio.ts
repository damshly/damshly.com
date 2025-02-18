import { S3Client } from "@aws-sdk/client-s3";
export const minioEndpoint = "http://localhost:9000"
export const s3 = new S3Client({
    region: "us-east-1", // يمكن أن يكون أي اسم (MinIO لا يتحقق من المنطقة)
    endpoint: minioEndpoint, // عنوان MinIO
    credentials: {
        accessKeyId: process.env.MINIO_ACCESS_KEY || "minioadmin",
        secretAccessKey: process.env.MINIO_SECRET_KEY || "minioadmin"
    },
    forcePathStyle: true // MinIO يحتاج إلى هذا الخيار
});

export const BUCKET_NAME = "profile-pictures"; // تأكد من إنشاء هذا الـ bucket في MinIO
