"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRefreshToken = exports.getRefreshToken = exports.saveRefreshToken = exports.deleteTempUser = exports.getTempUser = exports.saveTempUser = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const dotenv_1 = __importDefault(require("dotenv"));
const crypto_1 = require("crypto");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
dotenv_1.default.config();
const redis = new ioredis_1.default({
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: Number(process.env.REDIS_PORT) || 6379
});
const saveTempUser = (token_1, userData_1, ...args_1) => __awaiter(void 0, [token_1, userData_1, ...args_1], void 0, function* (token, userData, expiry = 600) {
    yield redis.setex(`verify:${token}`, expiry, JSON.stringify(userData));
});
exports.saveTempUser = saveTempUser;
const getTempUser = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield redis.get(`verify:${token}`);
    return data ? JSON.parse(data) : null;
});
exports.getTempUser = getTempUser;
const deleteTempUser = (token) => __awaiter(void 0, void 0, void 0, function* () {
    yield redis.del(`verify:${token}`);
});
exports.deleteTempUser = deleteTempUser;
const saveRefreshToken = (userId, refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(userId, refreshToken, "saving refresh token");
    const tokenId = (0, crypto_1.randomUUID)(); // إنشاء معرف فريد لكل Refresh Token
    const hashedToken = yield bcryptjs_1.default.hash(refreshToken, 10); // تشفير التوكن
    yield redis.setex(`refresh:${tokenId}`, 7 * 24 * 60 * 60, JSON.stringify({ userId, hashedToken }));
    console.log("refresh token saved");
    const data = yield redis.get(`refresh:${tokenId}`);
    console.log(data);
    return tokenId; // إرجاع معرف التوكن وليس التوكن نفسه
});
exports.saveRefreshToken = saveRefreshToken;
const getRefreshToken = (tokenId) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield redis.get(`refresh:${tokenId}`);
    return data ? JSON.parse(data) : null;
});
exports.getRefreshToken = getRefreshToken;
const deleteRefreshToken = (tokenId) => __awaiter(void 0, void 0, void 0, function* () {
    yield redis.del(`refresh:${tokenId}`);
});
exports.deleteRefreshToken = deleteRefreshToken;
exports.default = redis;
