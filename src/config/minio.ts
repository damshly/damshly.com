import { S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

dotenv.config();


export const minioEndpoint = `http://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}`;

export const s3 = new S3Client({
    region: "us-east-1",
    endpoint: minioEndpoint,
    credentials: {
        accessKeyId: process.env.MINIO_ACCESS_KEY || "minioadmin",
        secretAccessKey: process.env.MINIO_SECRET_KEY || "minioadmin"
    },
    forcePathStyle: true
});
