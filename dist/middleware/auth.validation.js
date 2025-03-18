"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthValidation = void 0;
const zod_1 = __importDefault(require("zod"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const registerSchema = zod_1.default.object({
    username: zod_1.default.string().min(3),
    email: zod_1.default.string().email(),
    password: zod_1.default.string().min(8)
});
const loginSchema = zod_1.default.object({
    email: zod_1.default.string().email(),
    password: zod_1.default.string().min(8)
});
class AuthValidation {
}
exports.AuthValidation = AuthValidation;
AuthValidation.validateRegister = (req, res, next) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        res.status(400).json({ error: "Invalid data. Please correct your input." });
        return;
    }
    const result = registerSchema.safeParse({ username, email, password });
    if (!result.success) {
        res.status(400).json({ error: result.error.errors });
        return;
    }
    next();
};
AuthValidation.validateLogin = (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ error: "Invalid credentials" });
        return;
    }
    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
        res.status(400).json({ error: result.error.errors });
        return;
    }
    next();
};
AuthValidation.checkJwt = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = { id: decoded.id }; // قم بتخزينه في `req.user`
    }
    catch (error) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    // console.log((req as any).user, "req.user");
    next();
};
AuthValidation.checkRefreshToken = (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        res.status(403).json({ message: "Refresh token required" });
        return;
    }
    // إذا كان التوكن موجودًا، نمرر التحكم للدالة التالية
    next();
};
