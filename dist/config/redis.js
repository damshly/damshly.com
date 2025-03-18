"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ioredis_1 = __importDefault(require("ioredis"));
const redis = new ioredis_1.default({
    host: process.env.REDIS_HOST, // أو اسم الخدمة في Docker مثل "redis_cache"
    port: 6379,
});
redis.on("connect", () => console.log("🔌 Connected to Redis!"));
redis.on("error", (err) => console.error("❌ Redis Error:", err));
exports.default = redis;
