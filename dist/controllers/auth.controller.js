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
exports.refreshToken = exports.logout = exports.login = exports.verifyEmail = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const redis_Service_1 = require("../services/redis.Service");
const email_Service_1 = require("../services/email.Service");
const user_Service_1 = require("../services/user.Service");
const user_model_1 = require("../models/user.model");
const redis_Service_2 = require("../services/redis.Service");
const auth_Service_1 = __importDefault(require("../services/auth.Service"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = req.body;
    const token = auth_Service_1.default.Maketoken({ username, email, password }, 15 * 60);
    yield (0, redis_Service_1.saveTempUser)(token, { username, email, password }, 15 * 60);
    // إرسال إيميل التحقق
    const emailResult = yield (0, email_Service_1.sendVerificationEmail)(email, token);
    if (!emailResult.success) {
        res.status(500).json({ error: "Failed to send verification email." });
    }
    res.status(200).json({ message: "Verification email sent. Please check your inbox." });
});
exports.register = register;
const verifyEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.query;
    if (!token || typeof token !== "string") {
        res.status(400).json({ error: "Invalid token." });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // التحقق من وجود بيانات المستخدم في Redis
        const userData = yield (0, redis_Service_1.getTempUser)(token);
        console.log(userData);
        if (!userData) {
            res.status(400).json({ error: "Invalid or expired token." });
        }
        // حفظ المستخدم في PostgreSQL عبر UserService
        const user = yield user_Service_1.UserService.registerUser(decoded.username, decoded.email, decoded.password);
        // حذف المستخدم من Redis بعد التسجيل الناجح
        yield (0, redis_Service_1.deleteTempUser)(token);
        const accessToken = jsonwebtoken_1.default.sign({ id: user[0].id, role: user[0].account_type }, process.env.JWT_SECRET, { expiresIn: "15m" });
        const refreshToken = jsonwebtoken_1.default.sign({ id: user[0].id }, process.env.JWT_SECRET, { expiresIn: "7d" });
        const refreshTokenId = yield (0, redis_Service_2.saveRefreshToken)(user[0].id, refreshToken);
        res.cookie("refreshToken", refreshTokenId, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.status(201).json({
            message: "Email verified successfully. User registered!",
            user,
            accessToken
        });
    }
    catch (error) {
        console.error("Error verifying token:", error);
        res.status(400).json({ error: "Invalid or expired token." });
    }
});
exports.verifyEmail = verifyEmail;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { password, email } = req.body;
    const user = yield user_model_1.UserModel.checkPassword(email, password);
    if (!user) {
        res.status(401).json({ message: "Invalid credentials" });
        return;
    }
    const accessToken = jsonwebtoken_1.default.sign({ id: user[0].id, role: user[0].account_type }, process.env.JWT_SECRET, { expiresIn: "15m" });
    const refreshToken = jsonwebtoken_1.default.sign({ id: user[0].id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    const refreshTokenId = yield (0, redis_Service_2.saveRefreshToken)(user[0].id, refreshToken);
    res.cookie("refreshToken", refreshTokenId, {
        httpOnly: true, // يمنع الوصول إليه عبر JavaScript
        secure: true, // يجعله يعمل فقط مع HTTPS
        sameSite: "strict", // يمنع هجمات CSRF
        maxAge: 7 * 24 * 60 * 60 * 1000, // أسبوع كامل
    });
    res.status(200).json({ user: user[0], accessToken, message: "successful" });
});
exports.login = login;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshTokenId = req.cookies.refreshToken;
    if (refreshTokenId) {
        yield (0, redis_Service_2.deleteRefreshToken)(refreshTokenId);
    }
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
    });
    res.status(200).json({ message: "Logged out successfully" });
});
exports.logout = logout;
const refreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshTokenId = req.cookies.refreshToken;
    const tokenData = yield (0, redis_Service_2.getRefreshToken)(refreshTokenId);
    if (!tokenData) {
        res.status(403).json({ message: "Invalid refresh token" });
        return;
    }
    const newAccessToken = jsonwebtoken_1.default.sign({ id: tokenData.userId }, process.env.JWT_SECRET, { expiresIn: "15m" });
    res.status(200).json({ accessToken: newAccessToken });
});
exports.refreshToken = refreshToken;
