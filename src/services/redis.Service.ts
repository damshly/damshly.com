import Redis from "ioredis";
import dotenv from "dotenv";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";

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

export const saveRefreshToken = async (userId: number, refreshToken: string) => {
    console.log(userId, refreshToken,"saving refresh token");
    
    const tokenId = randomUUID(); // generate a unique id for each refresh token
    const hashedToken = await bcrypt.hash(refreshToken, 10); // hash the token
    
    await redis.setex(`refresh:${tokenId}`, 7 * 24 * 60 * 60, JSON.stringify({ userId, hashedToken }));
    console.log("refresh token saved");
    const data = await redis.get(`refresh:${tokenId}`);
    console.log(data);
    
    return tokenId; // return the token id, not the token itself
};

export const getRefreshToken = async (tokenId: string) => {
    const data = await redis.get(`refresh:${tokenId}`);
    return data ? JSON.parse(data) : null;
};

export const deleteRefreshToken = async (tokenId: string) => {
    await redis.del(`refresh:${tokenId}`);
};

export default redis;

