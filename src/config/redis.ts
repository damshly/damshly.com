import Redis from "ioredis";

const redis = new Redis({
  host: "127.0.0.1", // أو اسم الخدمة في Docker مثل "redis_cache"
  port: 6379,
});

redis.on("connect", () => console.log("🔌 Connected to Redis!"));
redis.on("error", (err) => console.error("❌ Redis Error:", err));

export default redis;
