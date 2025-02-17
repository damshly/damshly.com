import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { getTempUser, deleteTempUser, saveTempUser} from "../services/redis.Service";
import { sendVerificationEmail } from "../services/email.Service";
import { UserService } from "../services/user.Service";
import { UserModel } from "../models/user.model";
import { saveRefreshToken, getRefreshToken, deleteRefreshToken } from "../services/redis.Service";
import bcrypt from "bcrypt";
interface registerBody {
    username: string;
    email: string;
    password: string;
}

export const register = async (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
         res.status(400).json({ error: "Invalid data. Please correct your input." });
    }

    const token = jwt.sign({ username, email, password }, process.env.JWT_SECRET as string, {
        expiresIn: "15m",
    });

    // حفظ بيانات المستخدم مؤقتًا في Redis
    await saveTempUser(token, { username, email, password }, 15 * 60); // 14 دقيقة

    // إرسال إيميل التحقق
    const emailResult = await sendVerificationEmail(email, token);

    if (!emailResult.success) {
         res.status(500).json({ error: "Failed to send verification email." });
    }

    res.status(200).json({ message: "Verification email sent. Please check your inbox." });
};

export const verifyEmail = async (req: Request, res: Response) => {
    const { token } = req.query;

    if (!token || typeof token !== "string") {
         res.status(400).json({ error: "Invalid token." });
         return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as unknown as {
            username: string;
            email: string;
            password: string;
        };

        // التحقق من وجود بيانات المستخدم في Redis
        const userData = await getTempUser(token);
        console.log(userData);
        
        if (!userData) {
             res.status(400).json({ error: "Invalid or expired token." });
        }

        // حفظ المستخدم في PostgreSQL عبر UserService
        const user = await UserService.registerUser(decoded.username, decoded.email, decoded.password);

        // حذف المستخدم من Redis بعد التسجيل الناجح
        await deleteTempUser(token);

        res.status(201).json({
            message: "Email verified successfully. User registered!",
            user,
        });
    } catch (error) {
        console.error("Error verifying token:", error);
         res.status(400).json({ error: "Invalid or expired token." });
    }
};

export const login = async (req: Request, res: Response) => {
    const { password, email } = req.body;
    const user = await UserModel.checkPassword(email, password);

    if (!user) {
        res.status(401).json({ message: "Invalid credentials" });
        return
    }

    const accessToken = jwt.sign({ id: user[0].id }, process.env.JWT_SECRET as string, { expiresIn: "15m" });
    const refreshToken = jwt.sign({ id: user[0].id }, process.env.JWT_SECRET as string, { expiresIn: "7d" });

    const refreshTokenId = await saveRefreshToken(user[0].id, refreshToken);

    res.cookie("refreshToken", refreshTokenId, {
        httpOnly: true, // يمنع الوصول إليه عبر JavaScript
        secure: true, // يجعله يعمل فقط مع HTTPS
        sameSite: "strict", // يمنع هجمات CSRF
        maxAge: 7 * 24 * 60 * 60 * 1000, // أسبوع كامل
    });

    res.status(200).json({ user: user[0], accessToken, message: "successful" });
};


export const logout = async (req: Request, res: Response) => {
    const refreshTokenId = req.cookies.refreshToken;

    if (refreshTokenId) {
        await deleteRefreshToken(refreshTokenId);
    }

    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
    });

    res.status(200).json({ message: "Logged out successfully" });
};


export const refreshToken = async (req: Request, res: Response) => {
    const refreshTokenId = req.cookies.refreshToken; // استرجاع التوكن من الكوكيز

    if (!refreshTokenId) {
        res.status(403).json({ message: "Refresh token required" });
        return 
    }

    const tokenData = await getRefreshToken(refreshTokenId);
    if (!tokenData) {
        res.status(403).json({ message: "Invalid refresh token" });
        return 
    }

    const newAccessToken = jwt.sign({ id: tokenData.userId }, process.env.JWT_SECRET as string, { expiresIn: "15m" });

    res.status(200).json({ accessToken: newAccessToken });
};

