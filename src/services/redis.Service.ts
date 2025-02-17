import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const redis = new Redis({
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: Number(process.env.REDIS_PORT) || 6379
});

export const saveTempUser = async (token: string, userData: any, expiry = 600) => {
    await redis.setex(`verify:${token}`, expiry, JSON.stringify(userData));
};

export const getTempUser = async (token: string) => {
    const data = await redis.get(`verify:${token}`);
    return data ? JSON.parse(data) : null;
};

export const deleteTempUser = async (token: string) => {
    await redis.del(`verify:${token}`);
};

export default redis;
